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
  actions: {},
  modules: {
    user,
  },
  plugins: [createPersistedState()],
});
