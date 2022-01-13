import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import user from './modules/user.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    darkTheme: false,
    // alert: {
    //   type: 'success',
    //   showing: false,
    //   message: 'Todo benne :D',
    // },
  },
  mutations: {
    // initStore(state) {
    //   if (state.user.username) return;
    // },
    toggleDarkTheme(state) {
      state.darkTheme = !state.darkTheme;
    },
    // changeAlertType(state, type) {
    //   state.alert.type = type;
    // },
    // alert(state) {
    //   state.alert.showing = !state.alert.showing;
    // },
  },
  actions: {
    // initStore({ dispatch }) {
    //   dispatch('checkLogin');
    // },
    // checkLogin() {
    //   //LLamada al servidor para comprobar si la sesión actual existe en una cookie
    //   api
    //     .checkLogin()
    //     .then(res => {
    //       console.log(res);
    //       if (res.status === 200) {
    //         console.log('Todavía logeado bitches 👌 ');
    //       }
    //     })
    //     .catch(() => console.error('Sesión no iniciada'));
    // },
  },
  modules: {
    user,
  },
  plugins: [createPersistedState()],
});
