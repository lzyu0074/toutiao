import { request } from '@/utils/request'

const getArticleListAPI = (page, limit) => {
  return request.get('/articles', {
    params: {
      _page: page,
      _limit: limit
    }
  })
}

export default getArticleListAPI
