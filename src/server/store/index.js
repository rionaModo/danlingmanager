import {hourse} from '@/utils/hourse';
// ====================================店铺
// 获取当前侍酒师全部推荐商品
export async function getAllRecommend (param = {}) {
  let data = await hourse.post(`/sommelier/shop-management/allRecommend`, param);
  return data;
}
// 侍酒师店铺添加推荐商品
export async function setAddRecommend (param = {}) {
  const data = await hourse.post(`/sommelier/shop-management/addRecommend`, param);
  return data;
}
// 侍酒师店铺取消推荐商品
export async function setCancelRecommend (param = {}) {
  const data = await hourse.post(`/sommelier/shop-management/cancelRecommend`, param);
  return data;
}
// 侍酒师店铺商品上下架
export async function setPutaway (param = {}) {
  const data = await hourse.post(`/sommelier/shop-management/putaway`, param);
  return data;
}

// 【筛选栏中属性标签】根据商品品类获取品类下全部
export async function getAllAttributes (param = {}) {
  const data = await hourse.post(`/sommelier/shop/allAttributes`, param);
  return data;
}
// 【页面左侧属性标签】根据商品品类获取属性
export async function getAttribute (param = {}) {
  const data = await hourse.post(`/sommelier/shop/attribute`, param);
  return data;
}
// 【侍酒师端】侍酒师店铺商品详情接口
export async function getCommodityDetails (param = {}) {
  const data = await hourse.post(`/sommelier/shop/commodityDetails`, param);
  return data;
}
// 【侍酒师端】侍酒师店铺商品评价接口
export async function getCommodityEvaluate (param = {}) {
  const data = await hourse.post(`/sommelier/shop/commodityEvaluate`, param);
  return data;
}
// 【侍酒师端】侍酒师店铺初始化接口
export async function getPersonageShopInint (param = {}) {
  let data = await hourse.post(`/sommelier/shop/personageShopInint`, param);
  return data;
}
// 【侍酒师端】侍酒师店铺商品搜索接口
export async function getProductSerch (param = {}) {
  const data = await hourse.post(`/sommelier/shop/productSerch`, param);
  return data;
}
// 【侍酒师端】侍酒师店铺商品上架
export async function setAllHelves (param = {}) {
  const data = await hourse.post(`/sommelier/shop/allHelves`, param);
  return data;
}
// 【侍酒师端】侍酒师店铺商品下架
export async function setAllShelves (param = {}) {
  const data = await hourse.post(`/sommelier/shop/allShelves`, param);
  return data;
}
// 【侍酒师端】侍酒师店铺是否全部上架
export async function getIsAllHelves (param = {}) {
  const data = await hourse.post(`/sommelier/shop/isAllHelves`, param);
  return data;
}
