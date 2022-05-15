<template>
  <div class="container">
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" fixed />

    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false" offset="10">
      <art-item :articleObj="article" v-for="article in articleList" :key="article.art_id" :isShowX="false"></art-item>
    </van-list>
  </div>
</template>

<script>
import { reqSearchResult } from '@/api/homeAPI'
import ArtItem from '@/components/ArtItem/ArtItem'
export default {
  name: 'SearchResult',
  props: ['searchword'],
  data() {
    return {
      page: 1,
      articleList: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    // 获取搜索结果
    async initSearchList() {
      try {
        const { data: res } = await reqSearchResult(this.page, this.searchword)
        console.log('搜索结果', res)
        if (res.message === 'OK') {
          this.articleList = [...this.articleList, ...res.data.results]
          this.loading = false
          if (res.data.results.length === 0) {
            this.finished = true
          }
        } else {
          this.$notify({ type: 'warning', message: '获取数据失败！' })
        }
      } catch (error) {
        this.$notify({ type: 'warning', message: '获取数据失败！' })
      }
    },
    // 加载更多文章
    onLoad() {
      this.page += 1
      this.initSearchList()
    }
  },
  mounted() {
    this.initSearchList()
  },
  components: {
    ArtItem
  }
}
</script>

<style lang="less" scoped>
.container {
  padding-top: 46px;
}
</style>
