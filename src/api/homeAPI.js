import { request } from '@/utils/request'

// 获取频道列表
export const getUserChannels = () => request.get('/v1_0/user/channels')

// 文章列表
export const getArtList = (channelid, timestamp) => request.get('/v1_0/articles', { params: { channel_id: channelid, timestamp } })

// 不感兴趣
export const reqDislikeArticle = (target) => request.post('/v1_0/article/dislikes', { target })

// 反馈垃圾类容、举报
export const reqReport = (target, type, remark) => request({ url: '/v1_0/article/reports', method: 'post', data: { target, type, remark } })

// 获取所有频道列表
export const reqAllChannels = () => request({ url: '/v1_0/channels', method: 'get' })

// 添加频道：（覆盖）
export const reqAddChannels = (channels) => request.put('/v1_0/user/channels', { channels })

// 搜索联想、建议
export const reqSearchSuggestion = (q) => request({ url: '/v1_0/suggestion', method: 'get', params: { q } })

// 搜索结果
export const reqSearchResult = (page, q) => request({ url: '/v1_0/search', method: 'get', params: { page, q } })
