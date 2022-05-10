import Vue from 'vue'
import VueRouter from 'vue-router'
import UserLogin from '@/views/UserLogin/UserLogin.vue'
import MainPage from '@/views/MainPage/MainPage.vue'
import MyHome from '@/views/MyHome/MyHome.vue'
import PersonalCenter from '@/views/PersonalCenter/PersonalCenter.vue'

Vue.use(VueRouter)

const routes = [

  { path: '/login', component: UserLogin, name: 'login' },
  { path: '/', redirect: '/main' },
  {
    path: '/main',
    component: MainPage,
    name: 'main',
    redirect: '/main/home',
    children: [
      { path: 'home', component: MyHome, name: 'home' },
      { path: 'personalcenter', component: PersonalCenter, name: 'personalcenter' }
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
