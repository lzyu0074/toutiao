import { request } from '@/utils/request'

// 用户登录
export const loginAPI = data => request.post('/v1_0/authorizations', data)

// 获取用户信息
export const reqGetUserInfo = () => request({ url: '/v1_0/user', method: 'get' })

// 获取用户资料（头像、名称、生日）
export const reqGetUserProfile = () => request({ url: '/v1_0/user/profile', method: 'get' })

// 修改用户Profile 传一个对象过来 想改名称、生日、头像都行
export const reqEditUserProfile = (Obj) => request({ url: '/v1_0/user/profile', method: 'patch', data: Obj })

// 修改头像
export const reqEditUserHead = (fd) => request({ url: '/v1_0/user/photo', method: 'patch', data: fd })
