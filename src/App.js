// 应用的根组件
import React, { Component } from "react";
import { Button, message } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/login";
import Admin from "./pages/admin/admin";
export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          {/* 只匹配其中一个 */}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Admin />}></Route>
        </Routes>
      </BrowserRouter>
    );
  }
}
