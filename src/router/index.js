import Vue from 'vue'
import VueRouter from 'vue-router'
import MyHome from '@/views/MyHome/MyHome.vue'
import MyUser from '@/views/MyUser/MyUser.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: MyHome },
  { path: '/user', component: MyUser }
]

const router = new VueRouter({
  routes
})

export default router
