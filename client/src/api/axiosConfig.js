import axios from 'axios';
const serverPort = 9000;
const BASE_URL = `http://localhost:${serverPort}`;
import store from '@/store/index';
import router from '@/router/index';

axios.defaults.baseURL = BASE_URL;

// Request interceptor
axios.interceptors.request.use(
  config => {
    //* Si el header está definido, significa que es un retry y ha sido definido en el response interceptor
    if (!config.headers['Authorization']) {
      config.headers[
        'Authorization'
      ] = `Bearer ${store.state.user.accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
let refresh = false;
axios.interceptors.response.use(
  res => res,
  async error => {
    const prevRequest = error.config;

    //* Si tenemos un 403 significa que el token ha expirado
    if (error.response.status === 403 && !refresh) {
      refresh = true;
      const { data } = await axios.get('/auth/refresh', {
        withCredentials: true,
      });

      //* Actualizamos los headers y el token almacenado en store
      store.commit('setUserToken', data.accessToken);
      prevRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
      return axios(prevRequest);
    }
    refresh = false;

    //* Si hay error es porque el JWT de refresco ha expirado, por lo tanto hacemos un friendly redirect hacia el login
    await store.dispatch('resetUser').then(() => {
      router.push({ name: 'login', params: { redirect: true } });
    });
    return Promise.reject(error);
  }
);

// export const axiosPrivate = axios.create({
//   baseURL: BASE_URL,
//   headers: {'Content-Type': 'application/json'},
//   withCredentials: true
// })