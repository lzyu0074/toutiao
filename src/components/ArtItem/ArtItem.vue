<template>
  <div class="art-item-container">
    <van-cell>
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <div class="titel-box">
          <span>{{ articleObj.title }}</span>
          <img v-lazy="articleObj.cover.images[0]" alt="" class="pic" v-if="articleObj.cover.type === 1" />
        </div>
        <div class="img-box" v-if="articleObj.cover.type === 3">
          <img v-lazy="imgUrl" alt="" class="pic" v-for="(imgUrl, index) in articleObj.cover.images" :key="index" />
        </div>
      </template>
      <!-- label自定义标题下方 label 的内容 -->
      <template #label>
        <div class="label-box">
          <span>作者:{{ articleObj.aut_name }} &nbsp;&nbsp; {{ articleObj.comm_count }}评论 &nbsp;&nbsp; 发布日期:{{ articleObj.pubdate | dateFormat }}</span>
          <!-- x 标签 -->
          <van-icon name="cross" @click="clickX" />
        </div>
      </template>
    </van-cell>
    <van-action-sheet v-model="show" :actions="actions" close-on-click-action :cancel-text="cancelText" :get-container="'body'" @select="onSelect" @cancel="onCancel" @closed="onClosed"> </van-action-sheet>
  </div>
</template>

<script>
import { firstReports, secondReports } from '@/api/reports'
import { reqDislikeArticle, reqReport } from '@/api/homeAPI'
export default {
  name: 'ArtItem',
  props: {
    articleObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 反馈面板
      show: false,
      actions: firstReports,
      cancelText: '取消',
      isFirst: true
    }
  },
  methods: {
    async onSelect(item) {
      if (item.name === '反馈垃圾内容') {
        this.actions = secondReports
        this.show = true

        this.cancelText = '返回'
        this.isFirst = false
      } else if (item.name === '不感兴趣') {
        const { data: res } = await reqDislikeArticle(this.articleObj.art_id)
        console.log(res)
        if (res.message === 'OK') {
          // 将文章id传给父组件，父组件将对应文章从列表移除
          this.$emit('dislikeArticleSuccess', res.data.target)
        }
        // 第二面板的点击
      } else {
        try {
          await reqReport(this.articleObj.art_id, item.value, '其他问题')

          this.$notify({ type: 'success', message: '反馈成功' })
        } catch (error) {
          this.$notify({ type: 'warning', message: '反馈失败' })
        }
      }
    },
    // 点击了文章底部的 X
    clickX() {
      this.show = true
    },
    onClosed() {
      // if (!this.isFirst && this.cancelText === '返回') {
      //   this.show = true
      //   this.actions = secondReports
      // }
      // if (this.isFirst && this.cancelText === '取消' && this.actions === secondReports) {
      //   this.show = true
      //   this.actions = firstReports
      //   this.cancelText = '取消'
      // }
    },
    onCancel() {
      if (this.cancelText === '返回') {
        this.show = true
        this.isFirst = true
        this.cancelText = '取消'
        this.actions = firstReports
      } else if (this.cancelText === '取消') {
        this.isFirst = true
        this.actions = firstReports
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pic {
  // 矩形黄金比例：0.618
  width: 113px;
  height: 70px;
  // 对图片进行裁剪，保留原始比例
  object-fit: cover;
}
.titel-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  span {
    flex: 1;
  }
}
.img-box {
  display: flex;
  justify-content: space-between;
}
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.FeedBack {
  text-align: center;
}
</style>
