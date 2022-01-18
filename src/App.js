// 应用的根组件
import React, { Component } from "react";
import { Button, message } from "antd";
import Login from "./pages/login/login";
import Admin from "./pages/admin/admin";
import { BrowserRouter, Switch, Route } from "react-router-dom";
export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {/* 只匹配其中一个 */}
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    );
  }
}
