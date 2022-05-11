<template>
  <div class="artlist-container">
    <!-- van-pull-refresh下拉加载更多 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" ref="vanPullRefresh">
      <!-- van-list上拉刷新 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
        <!-- 一条表示一个文章 -->
        <art-item v-for="art in artList" :key="art.art_id" :article-obj="art"></art-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArtItem from '@/components/ArtItem/ArtItem'
import { getArtList } from '@/api/homeAPI'
export default {
  name: 'ArtList',
  data() {
    return {
      // 时间戳
      timestamp: Date.now(),
      // 文章数组
      artList: [],
      loading: false,
      finished: false,
      isLoading: false
    }
  },

  methods: {
    // 初始化文章列表
    async initArtList(isPullRefresh) {
      const { data: res } = await getArtList(this.channelId, this.timestamp)
      if (res.message === 'OK') {
        console.log('initArtList', res.data)
        // 数据回来了，要把数据里的时间戳，赋值给自己的时间戳，用来下次请求数据的时候带上，表示这个数据我已经获取过，你要给我最新的数据
        this.timestamp = res.data.pre_timestamp
        if (res.data.pre_timestamp === null) {
          this.finished = true
        }
        if (isPullRefresh) {
          // 新旧数据拼接
          this.artList = [...res.data.results, ...this.artList]
          this.isLoading = false
        } else {
          this.artList = [...this.artList, ...res.data.results]
          // vant
          this.loading = false
        }
      }
    },
    // vant上拉加载更多
    onLoad() {
      console.log('上拉加载更多')
      this.initArtList()
    },
    // vant下拉刷新
    onRefresh() {
      if (!this.finished) {
        console.log('下拉刷新')
        this.initArtList(true)
      } else {
        console.log(this.$refs.vanPullRefresh)
        this.$refs.vanPullRefresh.loadingText = '没有更多了'
        this.$refs.vanPullRefresh.loosingText = '没有更多了loosing'
      }
    }
  },
  props: {
    channelId: {
      type: Number,
      required: true
    }
  },
  created() {
    this.initArtList()
  },
  components: {
    ArtItem
  }
}
</script>

<style lang="less" scoped>
.artlist-container {
  padding-top: 48px;
  padding-bottom: 50px;
}
</style>
