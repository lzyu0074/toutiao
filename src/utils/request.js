import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'
import { exchangeTokenAPI } from '@/api/exchangeTokenAPI'
import router from '@/router'

export const request = axios.create({
  // 原来的
  // baseURL: 'https://www.escook.cn'
  // 刘龙宾老师从黑马离职，接口已挂：
  // baseURL: 'http://www.liulongbin.top:8000'
  // 新接口基地址： 视频地址：https://www.bilibili.com/video/BV1D3411L7PP?spm_id_from=333.337.search-card.all.click
  baseURL: 'http://geek.itheima.net'
})

// 请求拦截器
request.interceptors.request.use(config => {
  // 请求头中加上token,Authorization是和后端沟通好的属性
  const token = store.state.tokenInfo.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // 展示loading效果
  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    // 展示时长为0时，Toast不会消失，直到请求回来了才会消失
    duration: 0
  })

  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
request.interceptors.response.use(response => {
  // 关闭loading效果
  Toast.clear()

  return response
}, async err => {
  // 无感token续签：
  // 响应401即为token过期

  // 请求是400+ 的时候，也关闭loading效果，避免一直loading一直转
  Toast.clear()

  const tokenInfo = store.state.tokenInfo

  try {
    // 判断该次请求失败，有没有响应，响应状态是不是401（401表示未认证/token过期），且store中的refresh_token是否存在
    if (err.response && err.response.status === 401 && tokenInfo.refresh_token) {
      console.log('token过期啦')
      // 带着refresh_token去请求新的token
      const { data: res } = await exchangeTokenAPI(tokenInfo.refresh_token)
      console.log('根据refreshtoken请求回来的token：', res)
      // 将请求回来的token带去vuex里更新一下(vuex里的updateTokenInfo会更新localstorage的tokenInfo)
      store.commit('updateTokenInfo', { token: res.data.token, refresh_token: tokenInfo.refresh_token })
      // 继续上次未完的请求，并返回请求结果，该结果将成为上次请求的返回值。请求配置直接用err.config就好
      return request(err.config)
    }
  } catch (error) {
    // 如果捕获到错误，说明refresh_token也过期了，此时需跳到登录页，并带着本来要去的地址
    const wantToPath = router.history.current.fullPath
    // 清空vuex和localstorage
    store.commit('clearState')
    router.push({ name: 'login', query: { pre: wantToPath } })
  }
  return Promise.reject(err)
})
