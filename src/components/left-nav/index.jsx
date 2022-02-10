import React, { Component } from "react";
import "./index.less";
import logo from "../../assets/images/logo.png";
import { Link, withRouter } from "react-router-dom";
import { Menu } from "antd";

import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
const { SubMenu } = Menu;
// 左侧导航的组件
class LeftNav extends Component {
  // 判断当前登录用户对item是否有权限
  hasAutu = (item) => {
    const { key, isPublic } = item;
    const menus = memoryUtils.user.role.menus;
    const username = memoryUtils.user.username;
    console.log(memoryUtils.user, "memoryUtils.user");
    //  1.如果当前用户是admin
    //  2.如果当前item是公开的
    //  3.当前用户有此item的权限：key有没有在menus中
    if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
      return true;
    } else if (item.children) {
      //  4.如果当前用户有此item 的某个子item的权限
      return !!item.children.find((child) => menus.indexOf(child.key) !== -1);
    }
    return false;
  };
  // 根据menu的数据数组生成对应的标签数组
  // 使用map() + 递归调用

  // 把icon:'home'改为icon: <HomeOutlined />并导入import {HomeOutlined}  from '@ant-design/icons';
  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname;
    return menuList.map((item) => {
      // 如果当前用户有item对应的权限，才需要显示对应的菜单项
      if (this.hasAutu(item)) {
        if (!item.children) {
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          );
        } else {
          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(
            (cItem) => path.indexOf(cItem.key) === 0
          );
          // 如果存在, 说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key;
          }
          return (
            <SubMenu
              key={item.key}
              icon={item.icon}
              title={
                <span>
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          );
        }
      }
    });
  };
  // 在第一次render()之前执行一次
  // 为第一个render()准备数据(必须同步的)
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList);
  }
  render() {
    // 得到当前请求的路由路径
    let path = this.props.location.pathname;
    if (path.indexOf("/product") === 0) {
      // 当前请求的是商品或其子路由界面
      path = "/product";
    }
    // 得到需要打开菜单项的key
    const openKey = this.openKey;
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >
          {this.menuNodes}
        </Menu>
      </div>
    );
  }
}

export default withRouter(LeftNav);
