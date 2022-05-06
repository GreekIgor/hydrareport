// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import setState from 'vue-setstate'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import App from './App'

import Login from './components/Login'
import Home from './page/Home'
import Telemarketolog from './page/Telemarketolog'
import DebtorsSMS from './page/DebtorsSMS'

import Users from './page/Users'

import { BootstrapVue, IconsPlugin, BToast} from 'bootstrap-vue'

import Select2 from 'v-select2-component'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import store from './store/store'

import Print from 'vue-print-nb'

var apiUrl = 'http://95.182.107.210:1177/laravel/public/API/'
var currentHost = document.location.hostname
var currentPort = document.location.port

if (currentHost === '192.168.1.24') { apiUrl = 'http://192.168.1.24/API/' } else
if (currentHost === '192.168.1.40') { apiUrl = 'http://192.168.1.40/laravel/public/API/' } else
if ((currentHost === '95.182.107.210') && (currentPort === 1177)) { apiUrl = 'http://95.182.107.210:1177/laravel/public/API/' }

apiUrl = 'http://hydrareport/API/'

//apiUrl = window.location.href + 'Report/API'
 //apiUrl = 'http://192.168.1.40/report/API/API/'

Vue.use(Print)

Vue.component('Select2', Select2)

Vue.component('b-toast', BToast)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(setState)

Vue.http.options.root = apiUrl

Vue.config.errorHandler = (err, vm, info) => {
  console.log('Произошла ошибка ' + err.message)
}

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/telemarketolog', component: Telemarketolog },
    { path: '/debtors', component: DebtorsSMS},
    { path: '/users', component: Users}

  ]
})

new Vue({
  store,
  router,
  components: { App },
  template: '<App/>',
  created: function () {
    var currentHost = document.location.host

    console.log(currentHost)
  }
}).$mount('#app')
