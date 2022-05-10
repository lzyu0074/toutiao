import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'

// 引入flexible
import 'amfe-flexible'
// 引入vant组件库
import Vant from 'vant'
import 'vant/lib/index.less'
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
