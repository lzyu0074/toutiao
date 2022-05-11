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
          <van-icon name="cross" />
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'ArtItem',
  props: {
    articleObj: {
      type: Object,
      required: true
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
</style>
