import Vue from 'vue';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import router from './router/index.js';
import '@/js/axiosConfig.js';
import '@/scss/reset.scss';
import '@/styles/index.css';

Vue.config.productionTip = false;

new Vue({
  store,
  vuetify,
  router,
  // beforeCreate() {
  //   store.dispatch('initStore');
  // },
  render: h => h(App),
}).$mount('#app');
