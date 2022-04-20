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

// * Helper variable para evitar un bucle de peticiones
let refresh = false;
// Response interceptor
axios.interceptors.response.use(
  res => {
    refresh = false;
    return res;
  },
  async error => {
    const prevRequest = error.config;
    console.log(
      'Status de response interceptor error: ',
      error.response.status
    );

    //* Si tenemos un 403 significa que el token de acceso ha expirado
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
    const allowedErrors = [400, 401, 403, 500];
    if (!allowedErrors.includes(error.response.status)) {
      //* Si hay error es porque el JWT de refresco ha expirado, por lo tanto hacemos un friendly redirect hacia el login
      await store.dispatch('resetUser').then(() => {
        router.push({ name: 'login', params: { redirect: true } });
      });
    }
    return Promise.reject(error);
  }
);
