import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: 'todomachine',
  },

  {
    path: '/todomachine',
    name: 'todomachine',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/todomachine/login',
    name: 'login',
    component: () => import('../components/LoginForm.vue'),
  },
  {
    path: '/todomachine/registro',
    component: () => import('../components/RegisterForm.vue'),
  },
  {
    path: '/todomachine/:username/:id',
    name: 'board',
    component: () => import('../components/Board.vue'),
    props: true,
  },
  {
    path: '/todomachine/:username',
    name: 'mainBoard',
    component: () => import('../views/UserBoardView.vue'),
    props: true,
    meta: {
      requiredAuth: true,
    },
  },
  {
    path: '*',
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
