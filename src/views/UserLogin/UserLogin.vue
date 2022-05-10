<template>
  <div class="login-container">
    <!-- 页头 -->
    <van-nav-bar title="登录" fixed />
    <!-- 表单 -->
    <van-form @submit="login">
      <van-field v-model="form.mobile" type="tel" name="手机号码" label="手机号码" placeholder="请输入手机号码" :rules="rules.mobile" />
      <van-field v-model="form.code" type="password" name="登录密码" label="登录密码" placeholder="请输入登录密码" :rules="rules.code" />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI } from '@/api/userAPI'
export default {
  name: 'UserLogin',
  data() {
    return {
      form: {
        // 手机号
        mobile: '13888888123',
        // 密码
        code: '246810'
      },
      // 校验规则
      rules: {
        mobile: [
          { required: true, message: '请填写您的手机号码', trigger: 'onBlur' },
          { pattern: /^1\d{10}$/, message: '请正确填写手机号码', trigger: 'onBlur' }
        ],
        code: [{ required: true, message: '请填写密码', trigger: 'onBlur' }]
      }
    }
  },
  methods: {
    async login() {
      const { data: res } = await loginAPI(this.form).catch((err) => err)
      console.log('登录：', res)
      if (res.message === 'OK') {
        // 设置vuex中的token并跳转路由
        this.$store.commit('updateTokenInfo', res.data)
        this.$router.push('/')
        console.log(this.$route)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  padding: 46px 0 50px;
}
</style>
