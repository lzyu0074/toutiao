<template>
  <div class="home_container">
    <van-nav-bar title="标题" fixed />
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">

      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">

        <ArticleInfo v-for="(item,i) in articleList" :key="i" :title="item.title" :cover="item.cover" :author-name="item.aut_name" :comment-count="item.comm_count" :publish-time="item.pubdate"></ArticleInfo>

      </van-list>

    </van-pull-refresh>
  </div>

</template>

<script>
import ArticleInfo from '@/components/ArticleInfo/ArticleInfo.vue'
import getArticleListAPI from '@/api/getArticleListAPI'
export default {
  name: 'MyHome',
  data() {
    return {
      data: 1,
      limit: 10,
      articleList: [],
      // 上拉加载更多 vant
      finished: false,
      loading: true,
      // 下拉刷新
      isLoading: false
    }
  },
  created() {
    this.getArticleList()
  },
  methods: {
    async getArticleList(isRefresh) {
      const { data: res } = await getArticleListAPI(this.data, this.limit)
      if (res.length === 0) this.finished = true
      if (isRefresh) {
        this.articleList = [...res, ...this.articleList]
        this.isLoading = false
        this.$toast('更新成功')
      } else {
        this.articleList = [...this.articleList, ...res]
        this.loading = false
      }
    },
    onLoad() {
      this.data++
      this.getArticleList()
    },
    onRefresh() {
      this.data++
      this.getArticleList(true)
    }
  },
  components: {
    ArticleInfo
  }
}
</script>

<style lang="less" scoped>
.home_container {
  padding: 46px 0 50px;
}
</style>
