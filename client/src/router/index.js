import Vue from 'vue';
import VueRouter from 'vue-router';
import { getUserByUsername } from '@/api';
import store from '@/store/index.js';
const isUserLoggedIn = store.state.user.loggedIn;
const username = store.state.user.username;

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: { name: 'home' },
  },
  {
    path: '/todomachine',
    name: 'home',

    component: () =>
      import(/*webpackChunkName: "HomeView"*/ '../views/HomeView.vue'),
    // * Hook de ruta. Si el usuario está logeado redirigimos desde Home hacia sus tableros
    beforeEnter: (to, from, next) => {
      if (isUserLoggedIn) {
        next({ name: 'mainBoard', params: { username } });
      } else {
        next();
      }
    },
  },
  {
    path: '/todomachine/login',
    name: 'login',
    component: () =>
      import(/*webpackChunkName: "LoginView"*/ '../components/LoginForm.vue'),
  },
  {
    path: '/todomachine/registro',
    name: 'register',
    component: () =>
      import(
        /*webpackChunkName: "RegisterView"*/ '../components/RegisterForm.vue'
      ),
  },
  {
    path: '/todomachine/:username/:name',
    name: 'board',
    component: () =>
      import(/*webpackChunkName: "CurrentBoard"*/ '../views/UserBoardView.vue'),
    props: true,
  },
  {
    path: '/todomachine/:username',
    name: 'mainBoard',
    component: () =>
      import(/*webpackChunkName: "AllBoards"*/ '../views/AllBoardsView.vue'),
    meta: {
      requiredAuth: true,
    },
    beforeEnter: (to, from, next) => {
      getUserByUsername(to.params.username).then(response => {
        if (response.data?.users?.length) {
          next();
        } else {
          next({ name: '404' });
        }
      });
    },
  },
  {
    path: '*',
    name: '404',
    component: () => import('../views/NotFoundView.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   // Comprobamos si alguna ruta (o hijo de esta) tiene la flag de requriedAuth
//   if (to.matched.some(record => record.meta.requiredAuth)) {
//     // Si el usuario no ha iniciado sesión e intenta entrar en alguna sección, se le redireccionará al formulario de login
//     if (store.state.user.loggedIn === false) {
//       next({
//         name: 'login',
//       });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

export default router;
