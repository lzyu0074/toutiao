<template>
  <div class="search-container">
    <div class="search-header">
      <!-- 返回按钮 -->
      <div class="back" @click="$router.back()">
        <van-icon name="arrow-left" size="18" />
      </div>
      <van-search v-model.trim="value" placeholder="请输入搜索关键词" background="transparent" shape="round" ref="search" />
    </div>
    <!-- 搜索建议 -->
    <div class="search-suggestion" v-if="searchSuggestionList.length > 0">
      <van-cell v-for="item in searchSuggestionList" :key="item" @click="gotoSearchResult">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <div v-html="item"></div>
        </template>
      </van-cell>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <!-- 右侧垃圾桶（删除） -->
          <van-icon name="delete-o" class="search-icon" @click="deleteHistory" />
        </template>
      </van-cell>
      <div class="history-list">
        <span class="history-item" v-for="item in history" :key="item" @click="gotoSearchResult">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { reqSearchSuggestion } from '@/api/homeAPI'
export default {
  name: 'ArtSearch',
  data() {
    return {
      // 搜索框的值
      value: '',
      // 输入框防抖
      timer: null,
      searchSuggestionList: [],
      history: JSON.parse(localStorage.getItem('history')) || []
    }
  },
  watch: {
    value(newVal) {
      clearTimeout(this.timer)
      if (newVal === '') {
        this.searchSuggestionList = []
        return
      }

      this.timer = setTimeout(() => {
        console.log(newVal)
        // 发请求获取建议数据
        this.getSuggestion()
      }, 500)
    },
    // 监视历史数组的变化，一变化就把它存在localStorage里
    history() {
      localStorage.setItem('history', JSON.stringify(this.history))
    }
  },
  methods: {
    // 请求获取搜索建议
    async getSuggestion() {
      const { data: res } = await reqSearchSuggestion(this.value)
      // this.highlightSearchWord(res.data.options, newVal)
      // this.searchSuggestionList = res.data.options
      // 将返回的搜索建议，添加高亮后赋值给searchSuggestionList
      this.searchSuggestionList = this.highlightSearchWord(res.data.options, this.value)
      // 将搜索内容添加到搜索历史数组里
      if (!this.history.includes(this.value)) this.history.push(this.value)
    },
    // 传入一个数组，将数组内每一项，关键词高亮
    highlightSearchWord(arr, searchWord) {
      // 用map对每项进行更改，返回一个新数组
      if (arr == null || arr.lenght === 0 || arr[0] == null) return []
      // 创建一个正则表达式对象，用来监测符合这个正则表达式的内容，替换成带span的标签，形成高亮
      const reg = new RegExp(searchWord, 'ig')
      const newArr = arr.map((element) => {
        return element.replace(reg, (item) => {
          return `<span style="color: red; font-weight: bold;font-size: 18px">${searchWord}</span>`
        })
      })
      return newArr
    },
    // 清空搜索历史
    deleteHistory() {
      this.history = []
      // 不用清空localStorage，因为监视器监视到history变化就会自动设置localStorage里的history为[]
    },
    // 点击搜索建议的项、搜索历史的项，跳到搜索结果页，带上点击的innerText
    gotoSearchResult(e) {
      const searchWord = e.target.innerText
      this.$router.push('/searchresult/' + searchWord)
    }
  },
  mounted() {
    document.querySelector('input[type=search]').focus()
  }
}
</script>

<style lang="less" scoped>
.search-header {
  display: flex;
  background-color: #007bff;
  align-items: center;
  color: #fff;
  height: 46px;
  .back {
    padding-left: 10px;
  }
  .van-search {
    flex: 1;
  }
}
.history-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  padding: 0 10px;
  .history-item {
    background-color: #efefef;
    padding: 10px;
    font-size: 14px;
    border-radius: 8px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
