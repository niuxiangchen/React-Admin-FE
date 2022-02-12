// 要求：能根据接口文档定义接口请求
// 包含应用中所有接口请求函数的模块
// 每个函数的返回值都是Promise

// 基本要求：能根据接口文档写出请求函数
import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";

const BASE = "/api";

// 登录
export const reqLogin = (username, password) =>
  ajax(BASE + "/login", { username, password }, "POST");
// // 添加用户
// export const reqAddUser = (user) =>
//   ajax(BASE + "/manage/user/add", user, "POST");
// 获取一级/二级分类的列表
export const reqCategorys = (parentId) =>
  ajax(BASE + "/manage/category/list", { parentId });
// 添加分类
export const reqAddCategorys = (categoryName, parentId) =>
  ajax(BASE + "/manage/category/add", { categoryName, parentId }, "POST");
// 更新分类
export const reqUpdateCategorys = (categoryId, categoryName) =>
  ajax(BASE + "/manage/category/update", { categoryId, categoryName }, "POST");
// 搜索商品分页列表
// 根据商品名称 searchType:搜索的类型，productName/productDesc
export const reqSearchProducts = ({
  pageNum,
  pageSize,
  searchName,
  searchType,
}) =>
  ajax(BASE + "/manage/product/search", {
    pageNum,
    pageSize,
    [searchType]: searchName, // 变量作为属性值 需要再前面加上[]
  });
// 获取一个分类
export const reqCategory = (categoryId) =>
  ajax(BASE + "/manage/category/info", { categoryId });
// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) =>
  ajax(BASE + "/manage/product/list", { pageNum, pageSize });
// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) =>
  ajax(BASE + "/manage/product/updateStatus", { productId, status }, "POST");
// 删除图片
export const reqDeleteImg = (name) =>
  ajax(BASE + "/manage/img/delete", { name }, "POST");
// 添加/更新 商品
export const reqAddOrUpdateProduct = (product) =>
  ajax(
    BASE + "/manage/product/" + (product._id ? "update" : "add"),
    product,
    "POST"
  );
// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + "./manage/role/list");
// 添加角色
export const reqAddRole = (roleName) =>
  ajax(BASE + "./manage/role/add", { roleName }, "POST");
// 更新角色
export const reqUpdateRole = (role) =>
  ajax(BASE + "./manage/role/update", role, "POST");
//获取所有用户的列表
export const reqUsers = () => ajax(BASE + "./manage/user/list");
//删除指定用户
export const reqDeleteUser = (userId) =>
  ajax(BASE + "./manage/user/delete", { userId }, "POST");
// 添加或更新用户
export const reqAddOrUpdateUser = (user) =>
  ajax("/manage/user/" + (user._id ? "update" : "add"), user, "POST");
// json请求的接口请求函数
export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=62c584c20c95a513e3d9128eadf27616`;
    // 发送jsonp请求
    jsonp(url, {}, (err, data) => {
      // 如果成功了
      if (!err && data.status === "1") {
        // 取出需要的数据
        const { weather } = data.lives[0];
        console.log(weather);
        resolve({ weather });
      } else {
        // 如果失败了
        message.error("获取天气信息失败");
      }
    });
  });
};
