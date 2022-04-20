import Vue from 'vue';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import router from './router/index.js';
import '@/api/axiosConfig';
import '@/styles/reset.css';
import '@/styles/index.css';

Vue.config.productionTip = false;

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app');
