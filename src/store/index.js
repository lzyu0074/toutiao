import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

// 在初始化vuex之前，读取本地存储是否有state，有就用这个值
let initState = {
  tokenInfo: {}
}
const localStorageState = localStorage.getItem('state')
if (localStorageState) {
  initState = JSON.parse(localStorageState)
}

export default new Vuex.Store({
  state: initState,

  mutations: {
    // 登录，更新token
    updateTokenInfo(state, payload) {
      // 存储token在vuex中
      state.tokenInfo = payload
      // 同时将state存到本地存储
      this.commit('saveStateToStorge')
    },
    saveStateToStorge(state) {
      localStorage.setItem('state', JSON.stringify(state))
    }
  },
  actions: {},
  getters: {}
})
