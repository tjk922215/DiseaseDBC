import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import axios from 'axios'

import App from './App.vue'
import router from './router.js'
import store from './store/index.js'
import config from './config.js'

Vue.use(ElementUI)

//  配置baseURL
// 'http://172.18.215.237:3000'
axios.defaults.baseURL = 'http://' + config.baseURL

var app = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
