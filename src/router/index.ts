import Vue from 'vue';
import axios from 'axios';
import Router from 'vue-router';
import EntityStore from '@/store/entity';
import UserStore from '@/store/user';
import ProjectStore from '@/store/project';
import Login from '../components/login.vue';
import Dashboard from '../components/dashboard.vue';
import Projects from '../components/projects.vue';
import Devices from '../components/devices.vue';
import Users from '../components/users.vue';
import Entities from '../components/entities.vue';
import * as firebase from 'firebase';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard,
      redirect: 'projects',
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: 'projects',
          name: 'projects',
          component: Projects,
        },
        {
          path: 'users',
          name: 'users',
          component: Users,
        },
        {
          path: 'devices',
          name: 'devices',
          component: Devices,
        },
        {
          path: 'entities/:entity',
          name: 'entities',
          component: Entities,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!UserStore.isLoggedIn) {
      next({
        path: '/login',
        query: {redirect: to.fullPath},
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    user.getIdToken().then((token) => {
      axios.defaults.headers.common.Authorization = 'Bearer ' + token;
      UserStore.commitSetLoggedIn(true);
      UserStore.dispatchLoadUsers();
      ProjectStore.dispatchLoadProjects();
      const route = router.currentRoute.query.redirect;
      router.push(route ? route : '/');
    });
  } else {
    axios.defaults.headers.common.Authorization = '';
    UserStore.commitSetLoggedIn(false);
    router.push('/login');
  }
});

export default router;
