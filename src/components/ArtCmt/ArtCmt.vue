<template>
  <div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false" offset="10">
      <!-- 评论列表 -->
      <div class="cmt-list">
        <!-- 评论的item项 -->
        <div class="cmt-item" v-for="cmt in cmtList" :key="cmt.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="cmt.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ cmt.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon name="like" size="16" color="red" v-if="cmt.is_liking" @click="onCancelLikingCom(cmt)"></van-icon>
              <van-icon name="like-o" size="16" color="grey" v-else @click="onLikingComment(cmt.com_id)"></van-icon>
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">{{ cmt.content }}</div>
          <!-- 尾部 -->
          <div class="cmt-footer">{{ cmt.pubdate | dateFormat }}</div>
        </div>
      </div>
    </van-list>

    <!-- 发表评论区域 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="isShow1" @click="onClickOne">
      <van-icon name="arrow-left" size="18" @click="$router.back()"></van-icon>
      <div class="ipt-cmt-div">发表评论</div>
      <div class="icon-box">
        <van-badge :content="total_count" max="99">
          <!-- 评论图标，点击会滑动到评论区 -->
          <van-icon name="chat-o" size="20" @click="scrollToCmtList" />
        </van-badge>
        <van-icon name="star-o" size="20" />
        <van-icon name="share-o" size="20" />
      </div>
    </div>
    <!-- 发表评论区输入框 2-->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea placeholder="友善评论、理性发言、阳光心灵" ref="commentArea" v-model="cmtContent" @blur="onCommentAreaBlur"></textarea>
      <van-button :disabled="cmtContent.length === 0" type="default" @click="onGotoComment">发表评论</van-button>
    </div>
  </div>
</template>

<script>
import { reqComments, reqLikingComments, reqCancelLikingComments, reqGotoComment } from '@/api/homeAPI'
// 滚动到评论的包
import { animate } from 'popmotion'
export default {
  name: 'ArtCmt',
  props: ['artid'],
  data() {
    return {
      cmtList: [],
      // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
      offset: null,
      // vant 上拉加载更多
      loading: false,
      finished: false,
      // 发表评论两个区域的动态展示
      isShow1: true,
      // 总评论数
      total_count: 0,
      // 评论内容
      cmtContent: ''
    }
  },
  methods: {
    // 从服务器获取评论
    async getComments() {
      const { data: res } = await reqComments('a', this.$route.params.articleid, this.offset)
      console.log('文章评论', res)
      if (res.message === 'OK') {
        // 将获取到的评论的last_id赋值给offset，下次请求带上offset，表示从这个last_id往后取
        this.offset = res.data.last_id
        // 赋值总评论数
        this.total_count = res.data.total_count
        this.cmtList = [...this.cmtList, ...res.data.results]
        this.loading = false
        if (res.data.results.length === 0) this.finished = true
      }
    },
    // 上拉加载更多
    onLoad() {
      this.getComments()
    },
    // 评论点赞
    async onLikingComment(comId) {
      const { data: res } = await reqLikingComments(comId)
      console.log('评论点赞', res)
      if (res.message === 'OK') {
        this.cmtList.some((item) => {
          if (item.com_id === comId) {
            item.is_liking = true
            return true
          }
          return false
        })
      }
    },
    // 取消点赞
    async onCancelLikingCom(cmt) {
      const res = await reqCancelLikingComments(cmt.com_id)
      if (res.status === 204) {
        cmt.is_liking = false
      }
    },
    // 点击了发表评论第一个区域
    onClickOne() {
      this.isShow1 = false
      this.$nextTick(() => {
        this.$refs.commentArea.focus()
      })
    },
    // 发表评论输入框 失去焦点
    onCommentAreaBlur() {
      setTimeout(() => {
        this.isShow1 = true
        this.cmtContent = ''
      }, 100)
    },
    // 发表评论
    async onGotoComment() {
      const { data: res } = await reqGotoComment(this.artid, this.cmtContent, this.artid)
      if (res.message === 'OK') {
        // 评论总数 + 1
        this.total_count += 1
        this.cmtList.unshift(res.data.new_obj)
        this.$notify({ type: 'success', message: '发表评论成功' })
      }
    },
    // 滑动到评论区
    scrollToCmtList() {
      // 当前滚动条的位置
      const now = window.scrollY
      console.log('now::::::::::::::', now)
      // 目标位置（文章信息区域高度）
      const dist = document.querySelector('.article-container').offsetHeight

      // 实现动画滚动
      animate({
        from: now,
        to: dist,
        onUpdate: (latest) => {
          window.scrollTo(0, latest)
        }
      })
    }
  },
  mounted() {
    this.getComments()
  }
}
</script>

<style lang="less" scoped>
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
.add-cmtbox {
  position: fixed;
  bottom: 0;
  left: 0;
}
// 为发表评论区域留出空间的类名
.art-cmt-contaner-1 {
  padding-top: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发表评论盒子
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
