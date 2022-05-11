import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import zh from 'dayjs/locale/zh-cn'

// 引入flexible
import 'amfe-flexible'
// 引入vant组件库
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'
Vue.use(Vant)
Vue.use(Lazyload)

// 计算相对时间
dayjs.extend(relativeTime)
// 配置中文包
dayjs.locale(zh)
Vue.filter('dateFormat', dt => {
  return dayjs().to(dt)
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
