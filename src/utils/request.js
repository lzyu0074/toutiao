import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

export const request = axios.create({
  // 原来的
  // baseURL: 'https://www.escook.cn'
  baseURL: 'http://www.liulongbin.top:8000'
})

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
request.interceptors.response.use(response => {
  // 关闭loading效果
  Toast.clear()

  return response
}, err => {
  return Promise.reject(err)
})
