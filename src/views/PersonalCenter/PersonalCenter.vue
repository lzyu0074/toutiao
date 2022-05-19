<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="userInfo.photo" alt="" class="avatar" />
        </template>
        <template #title>
          <span class="username">{{ userInfo.name }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userInfo.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ userInfo.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ userInfo.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link clickable @click="$router.push({ name: 'useredit' })" />
      <van-cell icon="chat-o" title="小思同学" is-link @click="$router.push({ name: 'xiaosi' })" />
      <van-cell icon="warning-o" title="退出登录" is-link clickable @click="onLogout" />
    </van-cell-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PersonalCenter',
  methods: {
    // 获取用户信息
    async getUserInfo() {
      try {
        await this.$store.dispatch('getUserInfo')
      } catch (error) {
        this.$notify({ type: 'warning', message: error })
      }
    },
    // 退出登录，清空本地存储的用户信息和token信息，并跳转到登录页
    async onLogout() {
      // 弹出确认框
      const dialogInfo = await this.$dialog
        .confirm({
          message: '退出登录？'
        })
        .catch((err) => err)
      // 如果点了取消，就不在运行后面的代码
      if (dialogInfo === 'cancel') return
      this.$store.commit('clearState')
      this.$router.push({ name: 'login' })
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created() {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background-color: #007bff;
      color: #fff;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
