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

// 关注作者
export const reqFollowings = (target) => request({ url: '/v1_0/user/followings', method: 'post', data: { target } })
// 取消关注作者
// export const reqCancelFollowings = (target) => request({ url: `/v1_0/user/followings/${target}`, method: 'delete' })
export const reqCancelFollowings = (target) => request.delete(`/v1_0/user/followings/${target}`)

// 文章详情
export const reqArticleDetail = (id) => request({ url: `/v1_0/articles/${id}`, method: 'get' })

// 收藏文章
export const reqLikings = (id) => request({ url: '/v1_0/article/collections', method: 'post', data: { target: id } })
// 取消收藏文章
export const reqCancelLikings = (id) => request({ url: `/v1_0/article/collections/${id}`, method: 'delete' })

// 获取评论
export const reqComments = (type, source, offset) => request({ url: '/v1_0/comments', method: 'get', params: { type, source, offset } })

// 评论点赞
export const reqLikingComments = (target) => request({ url: '/v1_0/comment/likings', method: 'post', data: { target } })

// 取消点赞
export const reqCancelLikingComments = (target) => request({ url: `/v1_0/comment/likings/${target}`, method: 'delete' })

// 发表评论
export const reqGotoComment = (target, content, artId) => request({ url: '/v1_0/comments', method: 'post', data: { target, content, art_id: artId } })
