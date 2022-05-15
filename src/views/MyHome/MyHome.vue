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
    <van-icon class="channel-plus" name="plus" size="0.48rem" @click="show = true" />
    <van-popup v-model="show" position="top" :style="{ height: '100%' }" get-container="body">
      <div class="popup-container">
        <!-- 弹出层的头部区域 -->
        <van-nav-bar title="频道管理">
          <template #right>
            <van-icon name="cross" size="14" color="white" @click="shutPopup"></van-icon>
          </template>
        </van-nav-bar>

        <!-- 弹出层的主体区域 -->
        <div class="pop-body">
          <div class="my-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">已添加频道：</span>
                <span class="title-gray">{{ isDel ? '点击删除频道' : '点击进入频道' }}</span>
              </div>
              <span class="btn-edit" @click="isDel = !isDel">{{ isDel ? '取消编辑' : '编辑' }}</span>
            </div>
            <!-- 我的频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="(item, index) in channelsList" :key="item.id" @click="clickDeleteChannel(item, index)">
                <!-- van-hairline--surround类是解决1px边框问题，可看vant官网 style内置样式 -->
                <div class="channel-item van-hairline--surround">
                  {{ item.name }}
                  <!-- 删除频道的徽标 -->
                  <van-badge class="cross-badge" v-if="isDel && item.name !== '推荐' && channelsList.length > 2">
                    <template #content>
                      <van-icon name="cross" class="badge-icon" />
                    </template>
                  </van-badge>
                </div>
              </van-col>
            </van-row>
          </div>
        </div>

        <!-- 分割线 -->
        <div class="van-hairline--top sp-line"></div>

        <!-- 更多频道 -->
        <div class="more-channel-box">
          <div class="channel-title">
            <div>
              <span class="title-bold">可添加频道：</span>
              <span class="title-grey">点击添加频道：</span>
            </div>
          </div>
          <!-- 更多频道列表 -->
          <van-row type="flex">
            <van-col span="6" v-for="item in moreChannelsList" :key="item.id" @click="clickAddChannels(item)">
              <!-- van-hairline--surround类是解决1px边框问题，可看vant官网 style内置样式 -->
              <div class="channel-item van-hairline--surround">
                {{ item.name }}

                <van-badge class="cross-badge">
                  <template #content>
                    <van-icon name="plus" class="badge-icon" />
                  </template>
                </van-badge>
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels, reqAllChannels, reqAddChannels } from '@/api/homeAPI'
import ArtList from '@/components/ArtList/ArtList.vue'
export default {
  name: 'MyHome',
  data() {
    return {
      // vant 顶部频道标签，active控制是第几个
      active: 0,
      // 我的频道列表
      channelsList: [],
      // vant 弹出层
      show: false,
      // 所有频道列表
      allChannelsList: [],
      // 点击了编辑按钮后的状态变量
      isDel: false
    }
  },
  created() {
    this.getChannelsList()
    this.getAllChannelsList()
  },
  methods: {
    // 获取用户频道
    async getChannelsList() {
      const { data: res } = await getUserChannels()
      console.log('getChannelsList', res)
      if (res.message === 'OK') {
        this.channelsList = res.data.channels
      }
    },
    // 获取所有频道列表
    async getAllChannelsList() {
      try {
        const { data: res } = await reqAllChannels()
        console.log('allchannelsList', res)
        if (res.message === 'OK') {
          this.allChannelsList = res.data.channels
        } else {
          this.$notify({ type: 'warning', message: '获取频道列表失败' })
        }
      } catch (error) {
        this.$notify({ type: 'warning', message: '获取频道列表失败' })
      }
    },
    // 更新频道（添加或删除）
    async updateChannels() {
      // 过滤出除推荐外的所有频道，并对每个项处理成接口需要的参数
      const channelsObj = this.channelsList
        .filter((item) => item.name !== '推荐')
        .map((item, index) => {
          return { id: item.id, seq: index + 1 }
        })
      // 发送请求
      try {
        const { data: res } = await reqAddChannels(channelsObj)
        if (res.message === '更新用户频道成功') {
          this.$notify({ type: 'success', message: '更新频道成功' })
        } else {
          this.$notify({ type: 'warning', message: '更新频道失败' })
        }
      } catch (error) {
        this.$notify({ type: 'warning', message: '更新频道失败' })
      }
    },
    // 点击了更多频道的项目，表示在用户频道中增加一项，就往用户频道中添加一项
    clickAddChannels(item) {
      this.channelsList.push(item)
      // 发请求更新频道
      this.updateChannels()
    },
    // 点击了编辑按钮后,可删除频道
    clickDeleteChannel(item, index) {
      // 确保是删除状态，且删除的不是‘推荐’,且频道列表大于2
      if (this.isDel && item.name !== '推荐' && this.channelsList.length > 2) {
        // 发送请求删除频道（更新频道）
        this.channelsList = this.channelsList.filter((myItem) => item.id !== myItem.id)
        this.updateChannels()
      }
      if (!this.isDel) {
        this.active = index
        this.show = false
      }
    },
    // 关闭弹出层
    shutPopup() {
      this.show = false
      this.isDel = false
    }
  },
  computed: {
    // 更多频道 = 所有频道 - 我的频道
    moreChannelsList() {
      return this.allChannelsList.filter((item) => {
        const result = this.channelsList.find((myItem) => myItem.id === item.id)
        if (result === undefined) return true
        return false
      })
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
/deep/ .channel-plus {
  position: fixed;
  top: 52px;
  right: 4px;
  padding: 5px;
  z-index: 99;
}
// 弹出层的样式
.van-popup,
.popup-container {
  // background-color: transparent;
  background-color: #fff;
  height: 100%;
  width: 100%;
}
.popup-container {
  display: flex;
  flex-direction: column;
}
.pop-body {
  // flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: #fff;
}
.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
    .title-bold {
      font-weight: bold;
    }
    .title-gray {
      color: gray;
      font-size: 12px;
    }
  }
}
.btn-edit {
  border: 1px solid #a3a2a2;
  padding: 0 10px;
  line-height: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
}
.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 6px;
}
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
  background-color: transparent;
}
.sp-line {
  margin: 10px 0 20px 0;
}
.badge-icon {
  display: block;
  font-size: 10px;
  line-height: 16px;
  color: black;
}
</style>
