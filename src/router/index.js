import Vue from 'vue'
import VueRouter from 'vue-router'
import UserLogin from '@/views/UserLogin/UserLogin.vue'
import MainPage from '@/views/MainPage/MainPage.vue'
import MyHome from '@/views/MyHome/MyHome.vue'
import PersonalCenter from '@/views/PersonalCenter/PersonalCenter.vue'
import ArtSearch from '@/views/ArtSearch/ArtSearch.vue'
import SearchResult from '@/views/SearchResult/SearchResult.vue'
import ArticleDetail from '@/views/ArticleDetail/ArticleDetail'
import UserEdit from '@/views/UserEdit/UserEdit'
import XiaoSi from '@/views/XiaoSi/XiaoSi'
import store from '@/store'

// 重写push，replace方法，捕获一下错误，防止路由报错
const originPush = VueRouter.prototype.push
VueRouter.prototype.push = function(location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(this, location, () => { }, () => { })
  }
}
const originReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function(location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(this, location, () => { }, () => { })
  }
}

// // 1. 将 VueRouter 本身提供的 $router.push 方法转存到常量中
// const originalPush = VueRouter.prototype.push
// // 2. 自定义 $router.push 方法，在内部调用原生的 originalPush 方法进行路由跳转；并通过 .catch 捕获错误
// VueRouter.prototype.push = function(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   // 通过 .catch 捕获错误
//   return originalPush.call(this, location).catch(err => err)
// }
// const originalReplace = VueRouter.prototype.replace
// VueRouter.prototype.replace = function(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
//   return originalReplace.call(this, location).catch(err => err)
// }

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
      // 我的 需要认证
      { path: 'personalcenter', component: PersonalCenter, name: 'personalcenter', meta: { needAuthorization: true } }
    ]
  },
  { path: '/search', component: ArtSearch, name: 'search' },
  { path: '/searchresult/:searchword', component: SearchResult, name: 'searchresult', props: true },
  { path: '/articledetail/:articleid', component: ArticleDetail, name: 'detail', props: true },
  // 编辑资料 需要认证
  { path: '/useredit', component: UserEdit, name: 'useredit', meta: { needAuthorization: true } },
  // 需要认证
  { path: '/xiaosi', component: XiaoSi, name: 'xiaosi', meta: { needAuthorization: true } }

]

const router = new VueRouter({
  routes
})

// 全局前置路由守卫,找出需要授权的页面，检查是否登录（vuex里的token是否有值），未登录则跳转登录页，登录了记住回到刚才想去的页面
router.beforeEach((to, from, next) => {
  console.log(window.history)
  if (to.meta.needAuthorization) {
    if (store.state.tokenInfo.token) {
      next()
    } else {
      next({ name: 'login', query: { pre: to.path } })
    }
  } else {
    next()
  }
})

export default router
