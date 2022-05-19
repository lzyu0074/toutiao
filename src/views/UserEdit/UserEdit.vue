<template>
  <div class="user-edit-container">
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="userProfile.photo" @click="$refs.fileInputRef.click()" />
          <!-- 文件选择框 -->
          <input type="file" accept="image/*" @change="onFileChange" v-show="false" ref="fileInputRef" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="userProfile.name" @click="onEditName" />
      <van-cell title="生日" is-link :value="userProfile.birthday" @click="onEditBirth" />
    </van-cell-group>
    <!-- 修改姓名弹出框 -->
    <van-dialog v-model="show" title="修改名称" show-cancel-button :before-close="nameInputBeforClose">
      <van-form>
        <van-field v-model.trim="name" placeholder="请输入用户名" input-align="center" maxlength="7" ref="nameInput" />
      </van-form>
    </van-dialog>
    <!-- 修改生日的动作面板 -->
    <van-action-sheet v-model="showBirthsheet" title="标题" :closeable="false">
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" @cancel="showBirthsheet = false" @confirm="onUpdateBirth" />
    </van-action-sheet>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { reqEditUserProfile, reqEditUserHead } from '@/api/userAPI'
import dayjs from 'dayjs'
export default {
  name: 'UserEdit',
  data() {
    return {
      // 修改姓名对话框：
      show: false,
      // 修改姓名的v-model
      name: '',
      // 修改生日的action-sheet
      showBirthsheet: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2021, 0, 17)
    }
  },
  methods: {
    // 头像
    async onFileChange(e) {
      const files = e.target.files
      console.log(e)
      console.log(files)
      if (files.length === 0) return
      const fd = new FormData()
      fd.append('photo', files[0])

      const { data: res } = await reqEditUserHead(fd)
      if (res.message === 'OK') {
        this.getUserProfile()
        this.$notify({ type: 'success', message: '头像修改成功' })
      }
    },
    // 编辑生日
    onEditBirth() {
      this.currentDate = this.userProfile.birthday ? new Date(this.userProfile.birthday) : new Date()
      this.showBirthsheet = true
    },
    // 发请求更新生日（点了确定）
    async onUpdateBirth(value) {
      this.showBirthsheet = false
      const formatDate = dayjs(value).format('YYYY-MM-DD')
      // 发请求更新生日：
      const { data: res } = await reqEditUserProfile({ birthday: formatDate })
      if (res.message === 'OK') {
        // 重新获取用户profile信息
        this.getUserProfile()
        this.$notify({ type: 'success', message: '生日修改成功' })
      }
    },
    // 修改名称
    onEditName() {
      this.show = true
      this.name = this.userProfile.name
      this.$nextTick(() => {
        this.$refs.nameInput.focus()
        setTimeout(() => {
          this.$refs.nameInput.focus()
        }, 500)
      })
    },
    nameInputBeforClose(action, done) {
      if (action === 'cancel') return done()
      if (this.name === '' || this.name.length > 7) {
        this.$notify({ type: 'danger', message: '名称长度为1-7个字符' })
        this.$refs.nameInput.focus()
        return done(false)
      }
      // 发请求改名称
      this.updateName(done)
    },
    // 发请求改名称
    async updateName(done) {
      const { data: res } = await reqEditUserProfile({ name: this.name })
      try {
        if (res.message === 'OK') {
          this.$notify({ type: 'success', message: '名称修改成功' })
          // 再次获取最新的用户profile
          this.getUserProfile()
          done()
        }
        // 如果返回的不是ok，是409：
      } catch (error) {
        if (error.response.status === 409) {
          // 用户名称呗占用
          this.$notify({ type: 'warning', message: '用户名称被占用，请更新后重试' })
          done(false)
          this.$refs.nameInput.focus()
        } else {
          this.$notify({ type: 'danger', message: '修改名称失败！' })
          done()
        }
      }
    },
    // 获取用户profile
    getUserProfile() {
      this.$store.dispatch('getUserProfile')
    }
  },
  created() {
    this.getUserProfile()
  },
  computed: {
    ...mapState(['userProfile'])
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
