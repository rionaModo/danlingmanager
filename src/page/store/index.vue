<template>
  <div class="page">
    <div class="header">
      <div class="left-btn" @click="setPutawayAll">
        <span v-if="shopInint">{{shopInint.allTheShelves?'全部下架':'全部上架'}}</span>
      </div>
      <h3>个人店铺</h3>
      <div class="right-btn" @click="toMessage">
        <i></i>
      </div>
    </div>
    <!--上菜单-->
    <div class="nav-top">
      <ul class="list" v-if="topAttribute&&topAttribute.length>0">
        <li :class="{'active':item.active===1}" v-for="(item,index) in topAttribute" :key="item.id" @click="changeTopAttribute(index)">
          <span>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="main">
      <!--左菜单-->
      <div class="nav-left">
        <ul class="list" v-if="leftAttribute&&leftAttribute.length>0">
          <li :class="{'active':item.active===1}" v-for="(item,index) in leftAttribute" :key="item.id" @click="changeLeftAttribute(index)">
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="main-right">
        <!--筛选菜单-->
        <div class="nav-filter">
          <ul class="list">
            <li class="active" @click="changeSortListShow">
              <span v-if="sortAttribute">{{sortAttribute[sortAttributeIndex].sort}}</span>
              <i></i>
            </li>
            <li @click="changeFilterContentShow" v-if="sortAttribute">
              <span>筛选</span>
            </li>
          </ul>
          <!--筛选菜单列表-->
          <ul class="nav-filter-con" v-if="sortList_show&&sortAttribute&&sortAttribute.length>0">
            <li :class="{'color1':item.active===1}" v-for="(item,index) in sortAttribute" :key="item.value" @click="changeSortAttribute(index)">
              <span>{{item.sort}}</span>
            </li>
          </ul>
        </div>
        <!--商品列表蒙层-->
        <div class="main-content-mask" @click="changeSortListShow" @touchmove.prevent="" v-if="sortList_show"></div>
        <div class="main-content">
          <!--商品列表-->
          <vue-scroll :onInfinite="onInfinite" :enableInfinite="enableInfinite">
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
                    <button @click="setPutaway(index)" v-if="item.isPutaway">商品下架</button>
                    <button class="color1" @click="setPutaway(index)" v-else>商品上架</button>
                    <button @click="setCancelRecommend(index)" v-if="item.isRecommend">取消推荐</button>
                    <button class="color1" @click="showMask(index,item)"  v-else>设为推荐</button>
                  </div>
                </li>
              </ul>
              <data-null v-if="product&&product.length===0" :text="'抱歉，没有找到相关美酒'"></data-null>
            </div>
          </vue-scroll>
        </div>
      </div>

    </div>
    <w-footer :page="'store'"></w-footer>
    <!--推荐-->
    <recommend-mask @hideMsk="hideMsk" @onSuccess="recommendSuccess" :goodsInfo="goodsInfo" v-if="mask_status"></recommend-mask>
    <!--筛选-->
    <transition name="fade" mode="out-in" appear>
      <div class="page-mask" v-show="filterContent_show">
        <div class="filter-main-mask" @touchmove.prevent="" @click="changeFilterContentShow"></div>
        <div class="filter-main">
          <div class="search" @touchmove.prevent="">
            <span>筛选</span>
            <div class="search-input" @click="toSearchResult">
              <em>请输入侍酒师相关信息</em>
              <i></i>
            </div>
            <button class="search-cancel" @click="changeFilterContentShow">取消</button>
          </div>
          <div class="content">
            <div class="price">
              <h5>价格区间</h5>
              <div class="price-input">
                <input :class="{'color1':minPrice}" type="tel" v-model="minPrice" @input="minPrice=minPrice.replace(/[^0-9-]+/,'')">
                <em></em>
                <input :class="{'color1':maxPrice}" type="tel" v-model="maxPrice" @input="maxPrice=maxPrice.replace(/[^0-9-]+/,'')">
              </div>
            </div>
            <div v-if="filterAttributes&&filterAttributes.length>0">
              <div class="classify" v-for="(item1,index1) in filterAttributes" :key="index1">
                <div class="classify-item" @click="selectFilter(index1)">
                  <span>{{item1.label}}</span>
                  <em v-if="item1.itemIndex||item1.itemIndex===0">
                    {{item1.items[item1.itemIndex].label}}
                  </em>
                  <i :class="{'rotate':item1.active===1}"></i>
                </div>
                <ul class="list" v-show="item1.active===1">
                  <li :class="{'color1':index2===item1.itemIndex}" v-for="(item2,index2) in item1.items" :key="index2" @click="selectFilterItem(index1,index2)">{{item2.label}}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="btn" @touchmove.prevent="">
            <button @click="resetFilter">重置选项</button>
            <button class="color1" @click="onFilter">确认</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import wFooter from '@/page/components/footer.vue';
import {getAllAttributes, getAttribute, getPersonageShopInint, getProductSerch, setCancelRecommend, setPutaway, setAllShelves, setAllHelves, getIsAllHelves} from '@/server/store/index';
import vueScroll from '@/page/components/vue-scroll';
import recommendMask from '@/page/components/store/recommend-mask';
import dataNull from '@/page/components/dataNull';
export default {
  name: 'index',
  data () {
    return {
      leftAttribute: null, // 左侧标签列表（根据顶部标签获取）
      leftAttributeIndex: 0,
      leftField: null, // 左侧标签所属类别
      topAttribute: null, // 顶部标签列表
      topAttributeIndex: 0,
      topAttributeId: null,
      sortAttribute: null, // 排序类型列表
      sortAttributeIndex: 0,
      filterAttributes: null, // 弹出层筛选项数据
      filterIndex: 0,
      shopInint: null, // 店铺初始化（顶部标签列表/排序类型列表）
      product: null, // 商品搜索结果(商品列表)
      sortList_show: false, // 排序列表弹出层显示状态
      filterContent_show: false, // 筛选弹出层显示状态
      mask_status: false,
      minPrice: '',
      maxPrice: '',
      filterArray: [], // 筛选集合

      pageNo: 1,
      pageSize: 20,
      totalPage: 999999,
      recommendIndex: null, // 记录推荐商品的下标
      enableInfinite: true
    };
  },
  components: {
    wFooter,
    recommendMask,
    vueScroll,
    dataNull
  },
  async created () {
    const that = this;

    await that.showStoreDialog();
    // 获取店铺初始化数据（头部筛选标签列表，排序类型列表）
    await that.getPersonageShopInint().then(data => {
      that.shopInint = data;
    });
    // 获取顶部标签列表
    that.topAttribute = that.shopInint.productCategoryRespVos;
    // 获取排序筛选列表
    let sortAttribute = [];
    // 遍历获取筛选项
    that.shopInint.lables.forEach(item1 => {
      item1.inf.forEach(item2 => {
        sortAttribute.push(item2);
      });
    });
    that.sortAttribute = sortAttribute;

    // 初始默认选中第一项
    that.topAttributeIndex = 0;
    that.$set(that.topAttribute[0], 'active', 1);

    that.sortAttributeIndex = 0;
    that.$set(that.sortAttribute[0], 'active', 1);
    // 根据顶部标签获取左侧标签列表
    await that.getLeftAttribute();
    // 获取商品列表
    that.pageNo = 1;
    that.enableInfinite = true;
    that.product = null;
    await that.getProductSerch().then(res => {
      let {data, code, msg} = res;
      if (data && code === 200) {
        that.product = data.content;
        that.totalPage = data.totalPage;
        that.pageNo = ++data.currentPage;
      } else {
        that.$wToast(msg);
      }
    });
  },

  methods: {
    // 每日弹出提示框
    showStoreDialog () {
      let that = this;
      let date = new Date();
      let today = new Date(new Date(date.toLocaleDateString()).getTime());
      let storeDialog = localStorage.getItem('storeDialog');
      if (storeDialog && storeDialog >= today) {

      } else {
        localStorage.setItem('storeDialog', date.getTime());
        that.$createDialog({
          content: '预估提成金额仅供参考，实际提成金额以订单完成后订单中展示金额为准。',
          confirmBtn: '确认'
        }).show();
      }
    },
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
      let {data, code} = await getPersonageShopInint();
      console.log(code);
      return data;
    },
    // 获取左侧标签列表
    async getLeftAttribute () {
      const that = this;
      const {data, code} = await getAttribute({
        categoryId: that.topAttribute[that.topAttributeIndex].id
      });
      console.log(code);
      that.leftAttribute = data.attributeValueList;
      that.leftField = data.field;
      that.leftAttributeIndex = 0;
      that.$set(that.leftAttribute[0], 'active', 1);
    },
    // 获取商品列表数据
    async getProductSerch () {
      const that = this;
      let res = await getProductSerch({
        category: that.topAttribute[that.topAttributeIndex].id,
        keyword: '',
        sorts: that.sortAttribute[that.sortAttributeIndex].value,
        shopSearchConditions: that.filterArray,
        pageNo: that.pageNo,
        pageSize: that.pageSize
      });
      return res;
    },
    // 选择顶部标签
    async changeTopAttribute (index) {
      const that = this;
      // =====显示loading
      that.$set(that.topAttribute[that.topAttributeIndex], 'active', 0);
      that.$set(that.topAttribute[index], 'active', 1);
      that.topAttributeIndex = index;
      // 重置选择id
      that.topAttributeId = null;
      // 重置筛选条件
      that.filterAttributes = null;
      that.minPrice = '';
      that.maxPrice = '';
      that.filterArray = [];
      // 获取左侧标签列表
      await that.getLeftAttribute();
      // 获取商品列表
      that.pageNo = 1;
      that.enableInfinite = true;
      that.product = null;
      // 改变排序列表显示状态
      that.SetSortListhide();
      await that.getProductSerch().then(res => {
        let {data, code, msg} = res;
        if (data && code === 200) {
          that.product = data.content;
          that.totalPage = data.totalPage;
          that.pageNo = ++data.currentPage;
        } else {
          that.$wToast(msg);
        }
      });
    },
    // 选择左侧标签
    async changeLeftAttribute (index) {
      const that = this;
      // =====显示loading
      that.$set(that.leftAttribute[that.leftAttributeIndex], 'active', 0);
      that.$set(that.leftAttribute[index], 'active', 1);
      that.leftAttributeIndex = index;
      /* 判断是否选择的全部 全部则重置筛选条件 不是全部则判断标签集合是否为空 不为空则判断是否添加或修改标签集合 为空则直接添加 */
      if (that.leftAttribute[index].id === '0') {
        that.filterArray = [];
      } else {
        if (that.filterArray.length > 0) {
          let valueObj = {};
          that.filterArray.forEach(item2 => {
            valueObj[item2.field] = item2.value;
          });
          valueObj[that.leftField] = that.leftAttribute[index].id;
          that.filterArray = [];
          for (let k in valueObj) {
            that.filterArray.push({field: k, value: valueObj[k]});
          }
        } else {
          that.filterArray.push({field: that.leftField, value: that.leftAttribute[index].id});
        }
      }
      // 获取商品列表
      that.pageNo = 1;
      that.enableInfinite = true;
      that.product = null;
      // 改变排序列表显示状态
      that.SetSortListhide();
      await that.getProductSerch().then(res => {
        let {data, code, msg} = res;
        if (data && code === 200) {
          that.product = data.content;
          that.totalPage = data.totalPage;
          that.pageNo = ++data.currentPage;
        } else {
          that.$wToast(msg);
        }
      });
    },
    // 选择排序方式
    async changeSortAttribute (index) {
      const that = this;
      that.$set(that.sortAttribute[that.sortAttributeIndex], 'active', 0);
      that.$set(that.sortAttribute[index], 'active', 1);
      that.sortAttributeIndex = index;

      // 获取商品列表
      that.pageNo = 1;
      that.enableInfinite = true;
      that.product = null;
      // 改变排序列表显示状态
      that.SetSortListhide();
      await that.getProductSerch().then(res => {
        let {data, code, msg} = res;
        if (data && code === 200) {
          that.product = data.content;
          that.totalPage = data.totalPage;
          that.pageNo = ++data.currentPage;
        } else {
          that.$wToast(msg);
        }
      });
    },
    // 获取弹出层筛选项数据
    async getAllAttributes () {
      const that = this;
      const {data, code, msg} = await getAllAttributes(
        {categoryId: that.topAttribute[that.topAttributeIndex].id}
      );
      if (code === 200 && data) {
        return data;
      } else {
        that.$wToast(msg);
      }
    },
    // 改变排序列表弹出层显示状态
    changeSortListShow () {
      const that = this;
      that.sortList_show = !that.sortList_show;
    },
    // 改变排序列表弹出层显示状态
    SetSortListhide () {
      const that = this;
      that.sortList_show = false;
    },
    // 改变筛选弹出层显示状态
    async changeFilterContentShow () {
      const that = this;
      that.SetSortListhide();
      that.filterContent_show = !that.filterContent_show;

      function setFilterAttributes (obj) {
        that.filterAttributes = null;
        that.$nextTick(function () {
          obj.forEach(item1 => {
            that.$set(item1, 'active', 0);
            that.$set(item1, 'itemIndex', null);
            item1.items.forEach((item2, index2) => {
              // 遍历已选择的标签集合，设置选中标签
              that.filterArray.forEach(item => {
                if (item1.field === item.field && item.value === item2.value) {
                  item1.itemIndex = index2;
                  that.$set(item2, 'active', 1);
                } else {
                  that.$set(item2, 'active', 0);
                }
              });
            });
          });
          that.filterAttributes = obj;
        });
      }
      if (that.topAttributeId === that.topAttribute[that.topAttributeIndex].id) {
        setFilterAttributes(that.filterAttributes);
        return false;
      } else {
        that.topAttributeId = that.topAttribute[that.topAttributeIndex].id;
        await that.getAllAttributes().then(data => {
          // 初始化数据（添加选中状态，选中index）
          setFilterAttributes(data);
          // 设置已选中标签
        });
      }
    },
    // 选择筛选
    selectFilter (index) {
      const that = this;
      that.filterAttributes[index].active === 1 ? that.filterAttributes[index].active = 0 : that.filterAttributes[index].active = 1;
    },
    // 选择筛选项下标签
    selectFilterItem (index1, index2) {
      const that = this;
      if (that.filterAttributes[index1].itemIndex === 0 || that.filterAttributes[index1].itemIndex) {
        that.filterAttributes[index1].items[that.filterAttributes[index1].itemIndex].active = 0;
      }
      // 判断是否已选择
      if (that.filterAttributes[index1].itemIndex + '' === index2 + '') {
        that.filterAttributes[index1].items[index2].active = 0;
        that.filterAttributes[index1].itemIndex = null;
      } else {
        that.filterAttributes[index1].items[index2].active = 1;
        that.filterAttributes[index1].itemIndex = index2;
      }
    },
    // 确定筛选
    async onFilter () {
      const that = this;
      // =====显示loading
      let filterArray = [];
      // 获取筛选框中选中筛选条件
      that.filterAttributes.forEach(item1 => {
        if (item1.itemIndex === 0 || item1.itemIndex) {
          filterArray.push({field: item1.field, value: item1.items[item1.itemIndex].value});
        }
        // item1.items.forEach(item2 => {
        //   if (item2.active === 1) {
        //     console.log(item2.active);
        //
        //   }
        // });
      });
      // 判断是否输入价格范围,并处理价格异常添加 添加筛选条件
      if (that.minPrice || that.maxPrice) {
        if (that.maxPrice === '0') {
          that.maxPrice = that.minPrice;
          that.minPrice = '0';
        }
        if ((!!that.minPrice && !!that.maxPrice)) {
          let thePrice = that.maxPrice;

          if (that.minPrice - that.maxPrice > 0) {
            that.maxPrice = that.minPrice;
            that.minPrice = thePrice;
          }
        }
        let getNumber = function (p) {
          if ((p - 0) > 0) {
            return (p * 100).toString();
          }
          return p;
        };
        filterArray.push({field: 'price', value: getNumber(that.minPrice) + '_' + getNumber(that.maxPrice)});
      }
      that.filterArray = filterArray;
      // 筛选与左侧标签同类型的标签
      let filterItem = that.filterArray.filter(item => {
        return item.field === that.leftField;
      });
      let leftArray = that.leftAttribute.map(item => {
        return item.id;
      });
      if (filterItem.length > 0 && leftArray.includes(filterItem[0].value)) {
        that.leftAttribute.forEach((item, index) => {
          if (item.id === filterItem[0].value) {
            that.$set(that.leftAttribute[that.leftAttributeIndex], 'active', 0);
            that.$set(that.leftAttribute[index], 'active', 1);
            that.leftAttributeIndex = index;
          }
        });
      } else if (leftArray.includes('0')) {
        that.leftAttribute.forEach((item, index) => {
          if (item.id === '0') {
            that.$set(that.leftAttribute[that.leftAttributeIndex], 'active', 0);
            that.$set(that.leftAttribute[index], 'active', 1);
            that.leftAttributeIndex = index;
          }
        });
      } else {
        that.$set(that.leftAttribute[that.leftAttributeIndex], 'active', 0);
        that.leftAttributeIndex = null;
      }

      that.pageNo = 1;
      that.enableInfinite = true;
      that.product = null;
      that.filterContent_show = false;
      await that.getProductSerch().then(res => {
        let {data, code, msg} = res;
        if (data && code === 200) {
          that.product = data.content;
          that.totalPage = data.totalPage;
          that.pageNo = ++data.currentPage;
        } else {
          that.$wToast(msg);
        }
      });
    },
    // 重置筛选
    resetFilter () {
      const that = this;
      // 重置筛选框中条件状态
      that.filterAttributes.forEach((item1, index) => {
        if (item1.itemIndex === 0 || item1.itemIndex) {
          that.$set(item1.items[item1.itemIndex], 'active', 0);
          item1.itemIndex = null;
        }
      });
      that.minPrice = '';
      that.maxPrice = '';
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
        that.getIsAllHelves().then(datao => {
          if (datao.data) {
            that.shopInint.allTheShelves = true;
          } else {
            that.shopInint.allTheShelves = false;
          }
        });
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
      that.product[that.recommendIndex].isPutaway = true;
      that.product[that.recommendIndex].isRecommend = !that.product[that.recommendIndex].isRecommend;
      that.recommendIndex = null;
      that.$createDialog({
        title: '设置成功',
        content: '该位置原有商品将依次右移或下移',
        confirmBtn: '我知道了'
      }).show();
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
    async getIsAllHelves () {
      const that = this;
      let {code, data, msg} = await getIsAllHelves();
      if (code === 200 && data) {
        return data;
      } else {
        that.$wToast(msg);
      }
    },
    // 上架全部
    async setAllHelves () {
      const that = this;
      let {code, data, msg} = await setAllHelves();
      if (code === 200 && data) {
        return data;
      } else {
        that.$wToast(msg);
      }
    },
    // 下架全部
    async setAllShelves () {
      const that = this;
      let {code, data, msg} = await setAllShelves();
      if (code === 200 && data) {
        return data;
      } else {
        that.$wToast(msg);
      }
    },
    setPutawayAll () {
      const that = this;
      if (that.shopInint.allTheShelves) {
        that.setAllShelves().then(data => {
          if (data.updated) {
            that.shopInint.allTheShelves = false;

            that.pageNo = 1;
            that.enableInfinite = true;
            that.product = null;
            that.getProductSerch().then(res => {
              let {data, code, msg} = res;
              if (data && code === 200) {
                that.product = data.content;
                that.totalPage = data.totalPage;
                that.pageNo = ++data.currentPage;
              } else {
                that.$wToast(msg);
              }
            });
          }
        });
      } else {
        that.setAllHelves().then(data => {
          if (data.updated) {
            that.shopInint.allTheShelves = true;

            that.pageNo = 1;
            that.enableInfinite = true;
            that.product = null;
            that.getProductSerch().then(res => {
              let {data, code, msg} = res;
              if (data && code === 200) {
                that.product = data.content;
                that.totalPage = data.totalPage;
                that.pageNo = ++data.currentPage;
              } else {
                that.$wToast(msg);
              }
            });
          }
        });
      }
    },
    // 跳转搜索列表页
    toSearchResult () {
      const that = this;
      that.$router.push({
        path: '/search'
      });
    },
    // 跳转商品详情页
    toGoodsDetail (gid, cid) {
      const that = this;
      that.$router.push({
        path: `/goodsDetail/${gid}/${cid}`
      });
    },
    toMessage () {
      const that = this;
      that.$router.push({
        path: `/message`
      });
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
    }
  }
  .header {
    width: 100%;
    height: .88rem;
    line-height: .88rem;
    background-color: #fff;
    border-bottom: 1px solid #E9E9E9;
    position: relative;
    h3 {
      text-align: center;
      font-size: .32rem;
      color: #4A4A4A;
    }

    .left-btn {
      position: absolute;
      top: 0;
      left: 0;
      height: inherit;
      padding: 0 .25rem;
      display: flex;
      align-items: center;
      cursor: pointer;

      span {
        font-size: .28rem;
        color: #333333;
      }

    }
    .right-btn{
      position: absolute;
      top: 0;
      right: 0;
      height: inherit;
      padding: 0 .25rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      span{
        font-size: .28rem;
        color: #333333;
      }
      img{
        width: .3rem;
        height: .3rem;
      }
      i{
        width: .4rem;
        height: .4rem;
        background-image: url("../../../static/images/xiaoxi_1.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }
  }
  .nav-top{
    display: flex;
    width: 100%;
    height: .95rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
    background-color: #fff;
    border-bottom: 1px solid #E9E9E9;

    .list{
      display: flex;
      >li{
        font-size: .28rem;
        color: #666;
        min-width: 1.5rem;
        max-width: 1.5rem;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span{
          display: inline-block;
          height: .91rem;
          line-height: .91rem;
          padding: 0 .1rem;
          text-align: center;
          border-bottom: .04rem solid rgba(255, 255, 255, 0);
        }
        &.active{
          span{
            color: #C9A268;
            border-bottom: .04rem solid #C9A268;
          }
        }
      }
    }
  }
  .main{
  display: flex;
  flex: 1;
  min-height: .95rem;;
  .nav-left{

    width: 1.48rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
    .list{
      width: 100%;
      background-color: #fff;
      >li{
        font-size: .26rem;
        color: #666;
        height: .88rem;
        border-bottom: #E5E5E5;
        display: flex;
        align-items: center;
        justify-content: center;
        span{
          text-align: center;
          line-height: .36rem;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }

        &.active{
          color: #C9A268;
          background-color: #F1F1F1;
        }
        &:last-child{
          border-bottom: 0;
        }
      }
    }
  }
  .main-right{
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: .2rem;
    position: relative;
    .nav-filter{
      height: .78rem;
      position: relative;
      z-index: 10;
      .list{
        width: 100%;
        display: flex;
        background-color: #fff;
        >li{
          font-size: .28rem;
          color: #666;
          width: 50%;
          height: .78rem;
          display: flex;
          align-items: center;
          justify-content: center;
          &.active{
            color: #C9A268;
          }
        }
      }
      .nav-filter-con{
        background-color: #fff;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        padding-bottom: .2rem;
        z-index: 10;
        >li{
          height: .8rem;
          font-size: .26rem;
          color: #666;
          display: flex;
          align-items: center;
          padding-left: .78rem;
          &.color1{
            color: #C9A268;
            background-color: #EFE3D2;
          }
          span{

          }

        }
      }
    }
    .main-content-mask{
      position: absolute;
      top: 0;
      left: .2rem;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 9;
    }
    .main-content{
      flex: 1;
      position: relative;
      z-index: 8;

      .content{
        padding: .1rem .1rem 0 0;
        .list{
          /*padding-top: .1rem;*/
          /*padding-right: .1rem;*/
          >li{
            margin-bottom: .1rem;
            background-color: #fff;
            &:last-child{
              margin-bottom: 0;
            }
            .info{
              display: flex;
              padding: .3rem .3rem .3rem .2rem ;
              .info-pic{
                min-width: 1.6rem;
                max-width: 1.6rem;
                height: 1.6rem;
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
                margin-left: .2rem;
                h5{
                  font-size: .24rem;
                  color: #333;
                  height: .7rem;
                  line-height: .35rem;
                  margin-bottom: .1rem;
                  word-wrap: break-word;
                  overflow: hidden;
                }
                p{
                  font-size: .26rem;
                  line-height: .4rem;
                  span{
                    color: #333;
                  }
                  del{
                    color: #ccc;
                    margin-left: .2rem;
                  }
                  em{
                    font-size: .22rem;
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
    }
  }

}
  .page-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:none;
    z-index: 11;
    .filter-main-mask{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
    }
    .filter-main{
      height: 100%;
      margin-left: 1.1rem;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      position: relative;
      .content{
        flex: 1;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
      };
      .search{
        display: flex;
        align-items: center;
        height: 1.2rem;
        padding-left: .12rem;
        /*border-bottom: 1px solid #e9e9e9;*/
        span{
          font-size: .34rem;
          color: #333;
          padding: 0 .3rem;
        }
        .search-input{
          flex-grow: 1;
          height: .6rem;
          border: 1px solid #ccc;
          padding: 0 .2rem;
          margin-right: .2rem;
          border-radius: .08rem;
          overflow: hidden;
          display: flex;
          align-items: center;
          em{
            flex: 1;
            font-size: .26rem;
            color: #ccc;
          }
          i{
            width: .23rem;
            height: .24rem;
            background-image: url("../../../static/images/sousuo.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
        }
        .search-cancel{
          font-size: .26rem;
          color: #333;
          padding: 0 .3rem;
          height: .6rem;
          background-color: #fff;
          border: none;
        }
      }
      .price{
        margin: 0 .3rem 0 .42rem;
        border-top: 1px solid #f1f1f1;
        .price-input{
          display: flex;
          align-items: center;
          input{
            width: 2.34rem;
            height: .5rem;
            line-height: .5rem;
            padding: .1rem 0;
            font-size: .3rem;
            color: #666;
            margin: .2rem 0 .25rem;
            text-align: center;
            border: 1px solid #ccc;
            border-radius: .08rem;
            background-color: #f6f6f6;
            -webkit-appearance: none;
            -moz-appearance: none;
            &.color1{
              background-color: #fff;
            }
          }
          em{
            width: .47rem;
            height: 1px;
            background-color: #ccc;
            margin: 0 .23rem;
          }
        }
        h5{
          font-size: .28rem;
          color: #333;
          margin: .25rem 0 0;
          line-height: .4rem;
        }

      }
      .classify,.place{
        padding: 0 .3rem 0 .42rem;
        display: flex;
        flex-direction: column;
        /*border-bottom: 1px solid #e9e9e9;*/
        .classify-item{
          font-size: .28rem;
          color: #333;
          padding: .3rem 0;
          display: flex;
          align-items: center;
          span{
            flex-grow: 1;
            min-width: max-content;
          }
          em{
            text-align: right;
            margin: 0 .2rem;
            color: #666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          i{
            width: .13rem;
            height: .23rem;
            background-image: url("../../../static/images/jiantou_r_g.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            &.rotate{
              transform: rotate(90deg);
            }
          }
        }
        .list{
          display: flex;
          flex-wrap: wrap;
          >li{
            font-size: .26rem;
            color: #9999;
            height: .6rem;
            line-height: .6rem;
            padding: 0 .15rem;
            margin: 0 .4rem .3rem 0;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: .08rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.color1{
              color: #C9A268;
              background-color: #EFE3D2;
              border: 1px solid #C9A268;
            }
          }
        }
      }
      .place{

      }
      .btn{
        display: flex;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        button{
          font-size: .3rem;
          color: #333;
          height: 1rem;
          width: 50%;
          text-align: center;
          line-height: 1rem;
          background-color: #fff;
          &.color1{
            color: #c9a268;
            background-color: #333;
          }
        }
      }
    }
  }
</style>
