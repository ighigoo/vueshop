// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'  // ajax的套件
import VueAxios from 'vue-axios' // 轉為Vue的套件
import App from './App'
import router from './router'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
