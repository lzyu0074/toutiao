// 这个js文件是用来带着refresh_token去请求新的token的
import axios from 'axios'

export const exchangeTokenAPI = refreshToken => {
  return axios({
    url: 'http://geek.itheima.net/v1_0/authorizations',
    method: 'put',
    headers: {
      Authorization: 'Bearer ' + refreshToken
    }
  })
}
