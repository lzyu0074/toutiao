<template>
  <div class="container">
    <!-- header区域 -->
    <van-nav-bar title="文章详情" fixed left-arrow @click-left="$router.back()" />

    <div class="article-container">
      <!-- 文章信息区域 -->
      <h1 class="title">{{ articleDetail.title }}</h1>
      <!-- 作者信息 -->
      <van-cell label="描述信息" size="large" center>
        <template #title>
          <span>{{ articleDetail.aut_name }}</span>
        </template>
        <template #icon>
          <img :src="articleDetail.aut_photo" width="50" height="50" class="touxiang" />
        </template>
        <template #label> {{ articleDetail.pubdate | dateFormat }} </template>
        <template #default>
          <!-- 是否关注 -->
          <van-button type="info" size="mini" v-if="articleDetail.is_followed" @click="onFollow(true)">已关注</van-button>
          <van-button plain type="info" size="mini" icon="plus" v-else @click="onFollow(false)">关注</van-button>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider />

      <!-- 文章正文 -->
      <div class="article" v-html="articleDetail.content"></div>

      <van-divider>End</van-divider>
      <!-- 是否点赞 -->
      <div class="btn-praise">
        <van-button icon="star-o" type="danger" plain v-if="!articleDetail.is_collected" @click="onLikings(false)">收藏</van-button>
        <van-button icon="star-o" type="danger" v-else @click="onLikings(true)">已收藏</van-button>
      </div>
    </div>
    <art-cmt :artid="articleDetail.art_id"></art-cmt>
  </div>
</template>

<script>
import { reqArticleDetail, reqFollowings, reqCancelFollowings, reqLikings, reqCancelLikings } from '@/api/homeAPI'
import ArtCmt from '@/components/ArtCmt/ArtCmt'
export default {
  name: 'ArticleDetail',
  props: ['articleid'],
  data() {
    return {
      articleDetail: {}
    }
  },
  methods: {
    async initArticle() {
      try {
        const { data: res } = await reqArticleDetail(this.articleid)
        console.log('文章详情：', res)
        if (res.message === 'OK') {
          this.articleDetail = res.data
        } else {
          this.$notify({ type: 'warning', message: '文章加载失败！' })
        }
      } catch (error) {
        this.$notify({ type: 'warning', message: '文章加载失败！' })
      }
    },
    // 关注作者、取消关注,isCancel为 是否是点击了取消关注
    async onFollow(isCancel) {
      if (isCancel) {
        const res = await reqCancelFollowings(this.articleDetail.aut_id)
        console.log('取消关注作者：', res)
        if (res.status === 204) {
          this.articleDetail.is_followed = false
        }
      } else {
        const { data: res } = await reqFollowings(this.articleDetail.aut_id)
        console.log('关注作者：', res)
        if (res.message === 'OK') {
          this.articleDetail.is_followed = true
        }
      }
    },
    // 收藏、取消收藏
    async onLikings(isCancel) {
      // 取消收藏
      if (isCancel) {
        const res = await reqCancelLikings(this.articleDetail.art_id)
        console.log('取消收藏：', res)
        if (res.status === 204) {
          this.articleDetail.is_collected = false
        }
      } else {
        // 收藏
        const { data: res } = await reqLikings(this.articleDetail.art_id)
        if (res.message === 'OK') {
          this.articleDetail.is_collected = true
        }
      }
    }
  },
  created() {
    this.initArticle()
  },
  components: {
    ArtCmt
  }
}
</script>

<style lang="less" scoped>
.touxiang {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}
.article-container {
  margin-top: 46px;
}
// 关注按钮文字居中
.van-button__text {
  line-height: 24px;
}
.container {
  width: 100%;
}

.article-container {
  padding: 12px 15px;
  // text-indent: 12px;
}
.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}
.article {
  font-size: 12px;
  line-height: 24px;
  // 不要让内容撑大总页面，让自身出现滚动条--start
  width: 100%;
  overflow-x: scroll;
  // 不要让内容撑大总页面，让自身出现滚动条---end
  word-break: break-all;
}
.btn-praise {
  display: flex;
  justify-content: center;
}
.title {
  font-size: 20px;
}
</style>
