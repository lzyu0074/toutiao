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
  },
  { path: '/search', component: ArtSearch, name: 'search' },
  { path: '/searchresult/:searchword', component: SearchResult, name: 'searchresult', props: true },
  { path: '/articledetail/:articleid', component: ArticleDetail, name: 'detail', props: true },
  { path: '/useredit', component: UserEdit, name: 'useredit' }

]

const router = new VueRouter({
  routes
})

export default router
