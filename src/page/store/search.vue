<template>
  <div class="page">
    <div class="seach-main">
      <div class="search-box">
        <div class="left-btn" @click="toBack">
          <i></i>
        </div>
        <div class="header-search">
          <form @submit.prevent="" action="#">
            <i></i>
            <input type="search" ref="search" v-model="keyword" @input="keyword=trim(keyword)" :placeholder="!isFocus&&!keyword?'搜索':''" @focus="isFocus=true" @blur="isFocus=false">
            <em @click="keyword=''"></em>
          </form>
        </div>
        <div class="right-btn" @click="onSearch">
          <em>搜索</em>
        </div>
      </div>
      <div class="seach-con">
        <h3>最近搜索</h3>
        <ul class="list">
          <li class="list-item" v-for="(item,index) in keywordsArray" :key="index" @click="chooseKeyword(item)">
            <span>{{item}}</span>
          </li>
        </ul>
        <div class="clear-box" v-if="keywordsArray.length>0">
          <div class="clear-btn" @click="clearKeyword">
            <i></i>
            清空历史
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {trim} from '@/utils/lib';

export default {
  name: 'search',
  data () {
    return {
      keyword: '',
      isFocus: false,
      keywordsArray: []
    };
  },
  created () {
    const that = this;
    // 1.获取保存的搜索关键字
    // 2.显示搜索框
    let Keywords = localStorage.getItem('productKeywords');
    let keywordsArray = [];
    if (Keywords) {
      keywordsArray = [...new Set(Keywords.split(','))];
    } else {
      keywordsArray = [];
    }
    that.keywordsArray = keywordsArray;
    that.isShowSearch = true;
    that.$nextTick(function () {
      that.$refs.search.focus();
    });
  },
  methods: {
    trim,
    chooseKeyword (text) {
      const that = this;
      that.keyword = text;
      that.onSearch();
    },
    clearKeyword () {
      const that = this;
      that.keywordsArray = [];
      localStorage.setItem('productKeywords', []);
    },
    async onSearch (e) {
      const that = this;
      // 判断按键
      that.$refs.search.blur();
      if (that.keyword && !that.keywordsArray.includes(that.keyword)) {
        that.keywordsArray.push(that.keyword);
        localStorage.setItem('productKeywords', that.keywordsArray);
      }
      that.$router.replace({
        path: '/searchResult',
        query: {
          keyword: that.keyword
        }
      });
    },
    toBack () {
      const that = this;
      that.$router.back();
    }
  }
};
</script>

<style lang="scss" scoped>
  .page{
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #F1F1F1;
    box-sizing: border-box;
    .seach-main{
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      overflow-scrolling: touch;
      background-color: #fff;
    }
  }
  .header-search{
    display: flex;
    align-items: center;
    flex-grow: 1;
    form{
      flex: 1;
      display: flex;
      position: relative;
      background-color: #EEEEEE;
      border: 1px solid #D2D2D2;
      outline: none;
      border-radius: .08rem;
      margin-right: .3rem;
      >em{
        width: .3rem;
        height: .3rem;
        background-image: url("../../../static/images/guanbi.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
        top: 50%;
        margin-top: -.15rem;
        right: .2rem;
      }
    }
    input,.search-div{
      flex: 1;
      height: .5rem;
      font-size: .26rem;
      /*padding: .1rem 0;*/
      background: none;
      /*border: 1px solid #D2D2D2;*/
      /*outline: none;*/
      /*border-radius: .08rem;*/
      padding: .1rem .1rem .1rem .63rem;
      box-sizing: border-box;
      -webkit-appearance: none;
      -moz-appearance: none;
    }
    .search-div{
      line-height: .3rem;
      span{
        color: #333;
      }
      em{
        color: #ccc;
      }
    }
    input::-webkit-input-placeholder,
    input::placeholder{
      color: #ccc;
    }

    i{
      width: .25rem;
      height: .26rem;
      background-image: url("../../../static/images/sousuo.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: absolute;
      top: 50%;
      margin-top: -.13rem;
      left: .2rem;
      pointer-events: none;
    }
  }
  .seach-main {
    position: relative;

    .left-btn {
      display: flex;
      align-items: center;
      font-size: .3rem;
      color: #666;
      padding: 0 .3rem;

      i {
        width: .15rem;
        height: .3rem;
        background-image: url("../../../static/images/jiantou_l.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }

    .search-box {
      position: relative;
      display: flex;
      height: .88rem;
      background-color: #fff;
      border-bottom: 1px solid #e9e9e9;

      .right-btn {
        font-size: .28rem;
        color: #333;
        display: flex;
        align-items: center;
        padding: 0 .3rem;
      }
    }

    .seach-con {
      margin-top: .2rem;
      padding: 0 .3rem;

      h3 {
        font-size: .28rem;
        color: #333;
      }

      .list {
        display: flex;
        flex-wrap: wrap;
        margin-top: .2rem;

        .list-item {
          font-size: .24rem;
          color: #666;
          height: .4rem;
          line-height: .4rem;
          padding: 0 .15rem;
          background-color: #e9e9e9;
          margin-bottom: .2rem;
          margin-right: .2rem;
          border-radius: .06rem;
        }
      }

      .clear-box {
        display: flex;
        justify-content: center;
        margin-top: .3rem;

        .clear-btn {
          font-size: .28rem;
          color: #666;
          height: .6rem;
          border: 1px solid #e9e9e9;
          border-radius: .08rem;
          text-align: center;
          background-color: #e9e9e9;
          padding: 0 .2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          i{
            width: .25rem;
            height: .26rem;
            background-image: url("../../../static/images/shanchu_1.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            margin-right: .1rem;
          }
        }
      }
    }

  }
</style>
