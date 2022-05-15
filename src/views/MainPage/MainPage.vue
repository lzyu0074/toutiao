<template>
  <!-- 主页面组件，在这里展示主页和我的 -->
  <div>
    <router-view></router-view>
    <!-- tabbar -->
    <van-tabbar route>
      <van-tabbar-item replace :to="{ name: 'home' }" icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item replace :to="{ name: 'personalcenter' }" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'MainPage'
}
</script>

<style></style>
