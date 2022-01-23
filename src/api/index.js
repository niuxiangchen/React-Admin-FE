// 要求：能根据接口文档定义接口请求
// 包含应用中所有接口请求函数的模块
// 每个函数的返回值都是Promise

// 基本要求：能根据接口文档写出请求函数
import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";
const BASE = "";

// 登录
export const reqLogin = (username, password) =>
  ajax(BASE + "/login", { username, password }, "POST");
// 添加用户
export const reqAddUser = (user) =>
  ajax(BASE + "/manage/user/add", user, "POST");
// 获取一级/二级分类的列表
export const reqCategorys = (parentId) =>
  ajax(BASE + "/manage/category/list", { parentId });
// 添加分类
export const reqAddCategorys = (categoryName, parentId) =>
  ajax(BASE + "/manage/category/add", { categoryName, parentId }, "POST");
// 更新分类
export const reqUpdateCategorys = ({ categoryId, categoryName }) =>
  ajax(BASE + "/manage/category/update", { categoryId, categoryName }, "POST");
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
