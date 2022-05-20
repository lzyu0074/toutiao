import Vuex from 'vuex'
import Vue from 'vue'
import { reqGetUserInfo, reqGetUserProfile } from '@/api/userAPI'

Vue.use(Vuex)

// 在初始化vuex之前，读取本地存储是否有state，有就用这个值
let initState = {
  tokenInfo: {},
  userInfo: {},
  userProfile: {}
}
const localStorageState = localStorage.getItem('state')
if (localStorageState) {
  initState = JSON.parse(localStorageState)
}

export default new Vuex.Store({
  state: initState,

  mutations: {
    // 登录，更新token,payload是登录组件请求回来的登录token数据，是一个对象，里面有token和refresh_token
    updateTokenInfo(state, payload) {
      // 存储token在vuex中
      state.tokenInfo = payload
      // 同时将state存到本地存储
      this.commit('saveStateToStorge')
    },
    // 将整个state保存在localStorage
    saveStateToStorge(state) {
      localStorage.setItem('state', JSON.stringify(state))
    },
    // 设置用户信息
    GETUSERINFO(state, data) {
      state.userInfo = data
    },
    // 退出登录，清空用户信息，token信息，并保存空的state到本地存储
    clearState(state) {
      state.tokenInfo = {}
      state.userInfo = {}
      state.userProfile = {}
      this.commit('saveStateToStorge')
    },
    // 设置用户profile
    GETUSERPROFILE(state, data) {
      state.userProfile = data
    }
  },
  actions: {
    // 获取用户信息
    async getUserInfo(context) {
      const { data: res } = await reqGetUserInfo()
      console.log('获取用户信息', res)
      if (res.message === 'OK') {
        context.commit('GETUSERINFO', res.data)
        // 上面mutation给state赋值了以后，把state保存在本地存储
        context.commit('saveStateToStorge')
        return 'ok'
      } else {
        return Promise.reject(new Error('获取用户信息失败'))
      }
    },
    // 获取用户资料，头像、生日，名称
    async getUserProfile({ commit }) {
      const { data: res } = await reqGetUserProfile()
      console.log('获取用户profile', res)
      if (res.message === 'OK') {
        commit('GETUSERPROFILE', res.data)
        commit('saveStateToStorge')
        return 'ok'
      } else {
        return Promise.reject(new Error('获取用户profile失败'))
      }
    }
  },
  getters: {
    // 计算用户头像
    userAvatar(state) {
      let imgUrl = 'https://img1.baidu.com/it/u=888366177,4101023314&fm=253&fmt=auto&app=138&f=JPEG?w=490&h=459'
      if (state.userInfo.photo) {
        imgUrl = state.userInfo.photo
      }
      return imgUrl
    },
    token(state) {
      return state.tokenInfo.token
    }
  }
})
