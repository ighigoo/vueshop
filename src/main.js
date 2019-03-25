// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'  // ajax的套件
import VueAxios from 'vue-axios' // 轉為Vue的套件
import 'bootstrap';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import App from './App'
import router from './router'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

//Vue.use(Loading);
Vue.component('Loading', Loading); // 全域啟用

axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',

  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  // ...
  if (to.meta.requiresAuth) {
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then(response => {
      if (response.data.success) {
        next();
      }
      else {
        next({
          path: '/login',
        });
      }
    });
  } else {
    next();
  }
})
