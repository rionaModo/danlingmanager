<template>
  <div class="page">
    <div class="header">
      <div class="left-btn" @click="toBack">
        <i></i>
      </div>
      <div class="header-search">
        <form @submit.prevent="" action="#">
          <i></i>
          <div class="search-div" @click="showSearch">
            <span v-if="keyword">{{keyword}}</span>
            <em v-else>搜索商品</em>
          </div>
        </form>
      </div>
      <!--<div class="header-btn" @click="setPutawayAll">-->
        <!--<button v-if="shopInint">{{shopInint.allTheShelves?'全部下架':'全部上架'}}</button>-->
      <!--</div>-->
    </div>
    <!--排序方式-->
    <div class="screen">
      <ul class="list">
        <li :class="{'color1':item1.active===1}" v-for="(item1,index1) in sortAttribute" :key="item1.value" @click="changeSortAttribute(index1)">
          <span>
            {{item1.name}}
          </span>
          <div class="icon-con" v-if="item1.inf.length>1">
            <div :class="{'icon-item':1,'up':item1.choose===2,'down':item1.choose===1}">
              <em></em>
              <b></b>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="main">
      <vue-scroll :on-infinite="onInfinite" :enableInfinite="enableInfinite" :enableRefresh="false">
        <div class="content">
          <ul class="list" v-if="product&&product.length>0">
            <li v-for="(item,index) in product" :key="index">
              <div class="info" @click="toGoodsDetail(item.productCode,item.categoryId)">
                <div class="info-pic">
                  <img v-lazy="item.logo">
                </div>
                <div class="info-con">
                  <h5>{{item.productName}}</h5>
                  <p>
                    <span>¥ {{item.finalPrice|getPrice}}</span>
                    <del>¥ {{item.marketPrice|getPrice}}</del>
                  </p>
                  <p>
                    <em>提成金额：¥ {{item.push|getPrice}}</em>
                  </p>
                </div>
              </div>
              <div class="btn">
                <button @click.stop="setPutaway(index)" v-if="item.isPutaway">商品下架</button>
                <button class="color1" @click.stop="setPutaway(index)" v-else>商品上架</button>
                <button @click.stop="setCancelRecommend(index)" v-if="item.isRecommend">取消推荐</button>
                <button class="color1" @click.stop="showMask(index,item)"  v-else>设为推荐</button>
              </div>
            </li>
          </ul>
          <data-null v-if="product&&product.length===0" :text="'抱歉，没有找到相关美酒'"></data-null>
        </div>
      </vue-scroll>
    </div>
    <recommend-mask @hideMsk="hideMsk" @onSuccess="recommendSuccess" :goodsInfo="goodsInfo" v-if="mask_status"></recommend-mask>
    <div class="seach-main" v-show="isShowSearch">
      <div class="search-box">
        <div class="left-btn" @click="hideSearch">
          <i></i>
        </div>
        <div class="header-search">
          <form @submit.prevent="" action="#">
            <i></i>
            <input type="search" ref="search" v-model="newKeyword" @input="newKeyword=trim(newKeyword)" :placeholder="!isFocus&&!newKeyword?'搜索':''" @focus="isFocus=true" @blur="isFocus=false">
            <em @click="newKeyword=''"></em>
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
          <div class="clear-btn" @click="clearKeyword"><i></i>清空历史</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {getPersonageShopInint, getProductSerch, setPutaway, setCancelRecommend} from '@/server/store/index';
import vueScroll from '@/page/components/vue-scroll';
import recommendMask from '@/page/components/store/recommend-mask';
import dataNull from '@/page/components/dataNull';
import {trim} from '@/utils/lib';
export default {
  name: 'search-result',
  data () {
    return {
      shopInint: null, // 初始数据
      product: null, // 商品列表
      sortAttribute: null, // 排序类型列表
      sortAttributeIndex: 0,
      keyword: '', // 搜索关键字
      newKeyword: '', //
      isFocus: false,
      goodsInfo: null, // 商品信息
      mask_status: false, // 弹出层显示状态
      sorts: '', // 排序方式
      pageNo: 1,
      pageSize: 20,
      totalPage: 999999,
      recommendIndex: null, // 记录推荐商品的下标
      enableInfinite: true,
      keywordsArray: [], // 搜索关键字数组
      isShowSearch: false
    };
  },
  components: {
    recommendMask,
    vueScroll,
    dataNull
  },
  async created () {
    const that = this;
    that.keyword = that.$route.query.keyword || '';

    // 获取店铺初始化数据（头部筛选标签列表，排序类型列表）
    await that.getPersonageShopInint().then(data => {
      that.shopInint = data;
    });
    // 获取排序筛选列表
    that.sortAttribute = that.shopInint.lables;
    that.sortAttributeIndex = 0;
    that.$set(that.sortAttribute[0], 'active', 1);
    that.$set(that.sortAttribute[0], 'choose', 1);
    that.sorts = that.sortAttribute[0].inf[0].value;
    // 显示搜索框
    // that.showSearch();
    // 获取商品列表数据
    await that.getProductSerch().then(res => {
      let {data, code, msg} = res;
      if (code === 200 && data) {
        that.product = data.content;
        that.totalPage = data.totalPage;
        that.pageNo = ++data.currentPage;
      } else {
        that.$wToast(msg);
      }
    });
  },
  methods: {
    trim,
    // 初始化分页加载
    onInfinite (done) {
      let that = this;
      that.getProductSerch().then(res => {
        let {data, code, msg} = res;
        if (code === 200 && data) {
          res.data = res.data || [];
          that.totalPage = res.data.totalPage;
          that.pageNo = ++data.currentPage;
          // 判断当前页数是否大于总页数
          if (that.pageNo > that.totalPage) {
            that.enableInfinite = false;
          }
          let arr = data.content;
          let addData = [];
          for (let i = 0; i < arr.length; i++) {
            let obj = Object.assign({}, arr[i]);
            addData.push(obj);
          }
          // 延时添加数据
          setTimeout(function () {
            that.product = that.product ? that.product : [];
            that.product = that.product.concat(addData);
            done();
          }, 200);
        } else {
          that.$wToast(msg);
        }
        // 判断获取数据是否为空 为空隐藏加载loading
      }, () => {
        console.log('error');
      });
    },
    // 获取店铺初始化数据
    async getPersonageShopInint () {
      const that = this;
      let {data, code, msg} = await getPersonageShopInint();
      if (code === 200 && data) {
        return data;
      } else {
        that.$wToast(msg);
      }
    },
    // 获取商品列表数据
    async getProductSerch () {
      const that = this;
      let res = await getProductSerch({
        category: '',
        keyword: that.keyword,
        sorts: that.sorts,
        shopSearchConditions: [],
        pageNo: that.pageNo,
        pageSize: that.pageSize
      });
      return res;
    },
    // 选择排序方式
    async changeSortAttribute (index) {
      const that = this;
      // 判断选择的排序设置显示状态
      if (that.sortAttribute[index].inf.length > 1) {
        if (that.sortAttribute[index].choose) {
          if (that.sortAttribute[index].choose === 1) {
            that.sortAttribute[index].choose = 2;
          } else {
            that.sortAttribute[index].choose = 1;
          }
        } else {
          that.$set(that.sortAttribute[that.sortAttributeIndex], 'choose', 0);
          that.$set(that.sortAttribute[index], 'choose', 1);
        }
      } else {
        that.$set(that.sortAttribute[that.sortAttributeIndex], 'choose', 0);
        that.$set(that.sortAttribute[index], 'choose', 1);
      }
      that.$set(that.sortAttribute[that.sortAttributeIndex], 'active', 0);
      that.$set(that.sortAttribute[index], 'active', 1);
      that.sortAttributeIndex = index;
      that.sorts = that.sortAttribute[index].inf[that.sortAttribute[index].choose - 1].value;
      // 获取商品列表
      that.pageNo = 1;
      that.enableInfinite = true;
      that.product = null;

      await that.getProductSerch().then(res => {
        let {data, code, msg} = res;
        if (code === 200 && data) {
          that.product = data.content;
          that.totalPage = data.totalPage;
          that.pageNo = ++data.currentPage;
        } else {
          that.$wToast(msg);
        }
      });
    },
    // 商品搜索
    async onSearch (e) {
      const that = this;
      that.keyword = that.newKeyword;
      that.$refs.search.blur();
      that.$router.replace({
        path: '/searchResult',
        query: {
          keyword: that.keyword
        }
      });
      // 获取商品列表
      that.pageNo = 1;
      that.enableInfinite = true;
      that.product = null;
      await that.getProductSerch().then(res => {
        let {data, code, msg} = res;
        if (that.keyword && !that.keywordsArray.includes(that.keyword)) {
          that.keywordsArray.push(that.keyword);
          localStorage.setItem('productKeywords', that.keywordsArray);
        }
        that.hideSearch();
        if (code === 200 && data) {
          that.product = data.content;
          that.totalPage = data.totalPage;
          that.pageNo = ++data.currentPage;
        } else {
          that.$wToast(msg);
        }
      });
    },
    // 上下架
    async setPutaway (index) {
      const that = this;
      const {data, code, msg} = await setPutaway({
        categoryId: that.product[index].categoryId,
        productCode: that.product[index].productCode
      });
      if (code === 200 && data) {
        if (that.product[index].isPutaway) {
          that.product[index].isRecommend = false;
          that.$wToast('已下架');
        } else {
          that.$wToast('已上架');
        }
      } else {
        that.$wToast(msg);
      }
      that.product[index].isPutaway = !that.product[index].isPutaway;
    },
    // 显示推荐弹出层
    showMask (index, item) {
      // 传入商品信息
      const that = this;
      that.recommendIndex = index;
      that.goodsInfo = item;
      that.mask_status = true;
    },
    // 隐藏推荐弹出层
    hideMsk () {
      const that = this;
      that.mask_status = false;
    },
    // 推荐成功
    recommendSuccess (index) {
      const that = this;
      that.mask_status = false;
      that.$wToast('推荐成功');
      that.product[that.recommendIndex].isPutaway = true;
      that.product[that.recommendIndex].isRecommend = !that.product[that.recommendIndex].isRecommend;
      that.recommendIndex = null;
    },
    // 取消推荐
    async setCancelRecommend (index) {
      const that = this;
      let {data, code, msg} = await setCancelRecommend({
        categoryId: that.product[index].categoryId,
        productCode: that.product[index].productCode
      });
      if (code === 200 && data) {
        that.$wToast('已取消推荐');
        that.product[index].isRecommend = !that.product[index].isRecommend;
      } else {
        that.$wToast(msg);
      }
    },
    // 跳转商品详情页
    toGoodsDetail (gid, cid) {
      const that = this;
      that.$router.push({
        path: `/goodsDetail/${gid}/${cid}`
      });
    },
    toBack () {
      const that = this;
      that.$router.back();
    },
    hideSearch () {
      const that = this;
      that.isShowSearch = false;
    },
    showSearch () {
      const that = this;
      that.newKeyword = that.keyword;
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
    chooseKeyword (text) {
      const that = this;
      that.newKeyword = text;
      that.onSearch();
    },
    clearKeyword () {
      const that = this;
      that.keywordsArray = [];
      localStorage.setItem('productKeywords', []);
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
    .main{
      flex: 1;
      position: relative;
    }
  }
  .header{
    display: flex;
    height: .88rem;
    background-color: #fff;
    border-bottom: 1px solid #e9e9e9;
    .left-btn{
      display: flex;
      align-items: center;
      font-size: .3rem;
      color: #666;
      padding: 0 .3rem;
      i{
        width: .15rem;
        height: .3rem;
        background-image: url("../../../static/images/jiantou_l.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }
    .header-btn{
      display: flex;
      align-items: center;
      button{
        height: 100%;
        font-size: .28rem;
        color: #333;
        padding: 0 .3rem;
        background-color: #fff;
      }
    }
  }
  .screen{
    width: 100%;
    display: flex;
    padding: 0 .1rem;
    background-color: #fff;
    border-bottom: 1px solid #e9e9e9;
    box-sizing: border-box;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
    .list{
      /*flex-grow: 1;*/
      display: flex;
      >li{
        font-size: .28rem;
        color: #666;
        min-width: 1.8rem;
        max-width: 1.8rem;
        height: .95rem;
        display: flex;
        align-items: center;
        justify-content: center;
        &.color1{
          color: #C9A268;
        }
        .icon-con{
          .icon-item{
            display: flex;
            flex-direction: column;
            margin-left: .1rem;
            &.down{
              b{
                border-top: .08rem solid #C9A268;
              }
            }
            &.up{
              em{
                border-bottom: .08rem solid #C9A268;
              }
            }
            em,b{
              width: 0;
              height: 0;
              border-left: .05rem solid transparent;
              border-right: .05rem solid transparent;
            }
            em{
              border-bottom: .08rem solid #D2D2D2;
            }
            b{
              border-top: .08rem solid #D2D2D2;
              margin-top: .05rem;
            }
          }
        }
      }
    }
  }
  .content{
    .list{
      /*padding-top: .1rem;*/
      /*padding-right: .1rem;*/
      >li{
        margin-bottom: .2rem;
        background-color: #fff;
        &:last-child{
          margin-bottom: 0;
        }
        .info{
          display: flex;
          padding: .3rem;
          .info-pic{
            min-width: 1.8rem;
            max-width: 1.8rem;
            height: 1.8rem;
            background-color: #f8f8f8;
            border-radius: .1rem;
            overflow: hidden;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .info-con{
            flex-grow: 1;
            margin-left: .3rem;
            h5{
              font-size: .28rem;
              color: #333;
              line-height: .4rem;
              word-break: break-all;
            }
            p{
              font-size: .30rem;
              line-height: .42rem;
              margin-top: .3rem;
              span{
                color: #333;
              }
              del{
                color: #ccc;
              }
              em{
                font-size: .26rem;
                color: #C9A268;
              }
            }
          }
        }
        .btn{
          height: .9rem;
          display: flex;
          align-items: center;
          flex-direction: row-reverse;
          padding: 0 .3rem;
          border-top: 1px solid #e9e9e9;
          button{
            font-size: .26rem;
            color: #999999;
            height: .5rem;
            line-height: .5rem;
            padding: 0 .08rem;
            margin-left: .4rem;
            background-color: #ffffff;
            border-radius: .08rem;
            border: 1px solid #CCCCCC;
            box-sizing: content-box;
            &.color1{
              color: #C9A268;
              border: 1px solid #C9A268;
            }
          }
        }
      }
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
  .seach-main{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .left-btn{
      display: flex;
      align-items: center;
      font-size: .3rem;
      color: #666;
      padding: 0 .3rem;
      i{
        width: .15rem;
        height: .3rem;
        background-image: url("../../../static/images/jiantou_l.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }
    .search-box{
      position: relative;
      display: flex;
      height: .88rem;
      background-color: #fff;
      border-bottom: 1px solid #e9e9e9;
      .right-btn{
        font-size: .28rem;
        color: #333;
        display: flex;
        align-items: center;
        padding: 0 .3rem;
      }
    }
    .seach-con{
      margin-top: .2rem;
      padding: 0 .3rem;
      h3{
        font-size: .28rem;
        color: #333;
      }
      .list{
        display: flex;
        flex-wrap: wrap;
        margin-top: .2rem;
        .list-item{
          font-size: .24rem;
          color: #666;
          height: .4rem;
          line-height: .4rem;
          padding: 0 .15rem;
          background-color:#e9e9e9;
          margin-bottom: .2rem;
          margin-right: .2rem;
          border-radius: .06rem;
        }
      }
      .clear-box{
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
