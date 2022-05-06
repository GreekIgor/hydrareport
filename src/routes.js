import Vue from 'vue';
import VueRouter from 'vue-router';

import AppProducts from './components/SelectStreet';
import AppCategories from './components/HelloWorld';

Vue.use(VueRouter);

let routes = [
  { name: 'products', path: '/', component: AppProducts},
  { name: 'categories', path: '/categories', component: AppCategories }
];

export default new VueRouter({
  routes
});
