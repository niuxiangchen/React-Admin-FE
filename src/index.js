// 应用的入口组件
import React, { Component } from "react";
import reactDom from "react-dom";
import App from "./App";
import "antd/dist/antd.css";
// 将App组件标签渲染到index页面的div上
reactDom.render(<App />, document.getElementById("root"));
