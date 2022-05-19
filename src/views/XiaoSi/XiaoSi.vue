<template>
  <div class="container">
    <van-nav-bar title="小思同学" fixed left-arrow @click-left="$router.back()" />

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(chat, index) in chatList" :key="index">
        <!-- 左侧机器人 -->
        <div class="chat-item left" v-if="chat.name === 'xs'">
          <van-image fit="cover" round src="https://fc1tn.baidu.com/it/u=2028190287,3575527984&fm=202&mola=new&crop=v1"></van-image>
          <div class="chat-pao">{{ chat.msg }}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-if="chat.name === 'me'">
          <div class="chat-pao">{{ chat.msg }}</div>
          <van-image fit="cover" round :src="userAvatar"></van-image>
        </div>
      </div>
    </div>

    <!-- 输入框区域 -->
    <div class="repaly-container van-hairline--top">
      <van-field v-model.trim="word" center placeholder="说点什么..." ref="inputWordRef">
        <template #button>
          <span style="font-size: 12px; color: #999" @click="send">发送</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { io } from 'socket.io-client'
let socket = null
export default {
  name: 'XiaoSi',
  data() {
    return {
      word: '',
      // 聊天列表
      chatList: [{ name: 'xs', msg: '你好，我是小思！' }]
    }
  },
  methods: {
    // 发送消息
    send() {
      if (!this.word) return
      this.chatList.push({ name: 'me', msg: this.word })
      this.word = ''
      this.$nextTick(() => {
        this.$refs.inputWordRef.focus()
      })
      // 发送消息给服务器
      socket.emit('send', { msg: this.word, timestamp: new Date().getTime() })
    },
    // 滚动到聊天list的底部----即聊天消息自动往上滚动
    scrollToLastItem() {
      this.$nextTick(() => {
        console.log(document.querySelectorAll('.chat-item')[this.chatList.length - 1], this.chatList.length - 1)
        document.querySelectorAll('.chat-item')[this.chatList.length - 1].scrollIntoView({
          behavior: 'smooth'
        })
      })
    }
  },
  // 监听数组的变化，实时滚动
  watch: {
    chatList() {
      this.scrollToLastItem()
    }
  },
  // 从vuex获取头像
  computed: {
    ...mapGetters(['userAvatar', 'token'])
  },
  created() {
    this.$nextTick(() => {
      this.$refs.inputWordRef.focus()
    })
    // socket = io('http://geek.itheima.net/v1_0/socket.io/')
    // 创建客户端 websocket 的实例
    socket = io('http://geek.itheima.net', {
      query: {
        token: this.token
      },
      transports: ['websocket']
    })
    // 监听接连与断开
    socket.on('connect', () => console.log('connect: websocket 连接成功！'))
    socket.on('disconnect', () => console.log('disconnect: websocket 链接关闭'))

    // 接收服务器的消息
    socket.on('message', (msg) => {
      this.chatList.push({ name: 'xs', msg })
    })
  },
  beforeDestroy() {
    socket.close()
    socket = null
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background-color: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    // 隐藏滚动条
    // &::-webkit-scrollbar {
    //   width: 0 !important;
    // }

    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 20px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background-color: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  line-height: 38px;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.repaly-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background-color: #f5f5f5;
  z-index: 9999;
}
</style>
