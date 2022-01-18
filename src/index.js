// 应用的入口组件
import React, { Component } from "react";
import reactDom from "react-dom";
import App from "./App";
import "antd/dist/antd.css";
import memoryUtils from "./utils/memoryUtils";
import storageUtils from "./utils/storageUtils";
// 读取local中保存的user，保存到内存中
const user = storageUtils.getUser();
memoryUtils.user = user;
// 将App组件标签渲染到index页面的div上
reactDom.render(<App />, document.getElementById("root"));
