import { request } from '@/utils/request'

// 获取频道列表
export const getUserChannels = () => request.get('/v1_0/user/channels')

// 文章列表
export const getArtList = (channelid, timestamp) => request.get('/v1_0/articles', { params: { channel_id: channelid, timestamp } })
