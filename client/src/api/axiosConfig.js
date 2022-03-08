import axios from 'axios';
const serverPort = 9000;
const BASE_URL = `http://localhost:${serverPort}`;
import store from '@/store/index';

axios.defaults.baseURL = BASE_URL;

// Request interceptor
axios.interceptors.request.use(
  config => {
    if (!config.headers['Authorization']) {
      config.headers[
        'Authorization'
      ] = `Bearer ${store.state.user.accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

let refresh = false;
// Response interceptor
axios.interceptors.response.use(
  res => res,
  async error => {
    const prevRequest = error.config;
    if (error.response.status === 403 && !refresh) {
      refresh = true;
      const { data } = await axios.get('/auth/refresh', {
        withCredentials: true,
      });
      prevRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
      return axios(prevRequest);
    }
    refresh = false;
    return Promise.reject(error);
  }
);

// export const axiosPrivate = axios.create({
//   baseURL: BASE_URL,
//   headers: {'Content-Type': 'application/json'},
//   withCredentials: true
// })
