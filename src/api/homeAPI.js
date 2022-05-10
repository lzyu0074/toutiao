import { request } from '@/utils/request'

export const getUserChannels = () => request.get('/v1_0/user/channels')
