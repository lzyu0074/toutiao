import { request } from '@/utils/request'

// 用户登录
export const loginAPI = data => request.post('/v1_0/authorizations', data)
