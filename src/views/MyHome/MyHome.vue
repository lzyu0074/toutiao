<template>
  <div>
    <!-- 最顶部navbar -->
    <van-nav-bar title="明日头条" fixed>
      <template #right>
        <van-icon name="search" size="0.48rem" />
      </template>
    </van-nav-bar>
    <!-- 顶部频道标签 -->
    <van-tabs v-model="active" sticky offset-top="1.22666667rem">
      <van-tab :title="channel.name" v-for="channel in channelsList" :key="channel.id">
        <!-- 子组件文章列表 -->
        <art-list :channel-id="channel.id"></art-list>
      </van-tab>
    </van-tabs>
    <!-- 右侧 “+”小图标 -->
    <van-icon name="plus" size="0.48rem" />
  </div>
</template>

<script>
import { getUserChannels } from '@/api/homeAPI'
import ArtList from '@/components/ArtList/ArtList.vue'
export default {
  name: 'MyHome',
  data() {
    return {
      // vant
      active: 0,
      channelsList: []
    }
  },
  created() {
    this.getChannelsList()
  },
  methods: {
    async getChannelsList() {
      const { data: res } = await getUserChannels()
      console.log('getChannelsList', res)
      if (res.message === 'OK') {
        this.channelsList = res.data.channels
      }
    }
  },
  components: {
    ArtList
  }
}
</script>

<style lang="less" scoped>
// 预留右侧 + 号的空位
/deep/ .van-tabs__wrap {
  padding-right: 36px;
  background-color: white;
}
// 右侧 + 号定位
/deep/ .van-icon-plus {
  position: fixed;
  top: 52px;
  right: 4px;
  padding: 5px;
  z-index: 9999;
}
</style>
