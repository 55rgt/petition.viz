import Vue from 'vue';
import Router from 'vue-router';
import MainPage from '../page/main';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/main',
      name: 'PetitionViz',
      component: MainPage
    }
  ]
});
