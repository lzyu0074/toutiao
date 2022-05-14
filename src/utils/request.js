import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

export const request = axios.create({
  // 原来的
  // baseURL: 'https://www.escook.cn'
  // 刘龙宾老师从黑马离职，接口已挂：
  // baseURL: 'http://www.liulongbin.top:8000'
  // 新接口基地址： 视频地址：https://www.bilibili.com/video/BV1D3411L7PP?spm_id_from=333.337.search-card.all.click
  baseURL: 'http://geek.itheima.net'
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
