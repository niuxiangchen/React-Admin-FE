import React, { Component } from "react";
import "./index.less";
import moment from "moment";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { reqWeather } from "../../api";
import { withRouter } from "react-router-dom";
import menuList from "../../config/menuConfig";
import { Modal } from "antd";
import LinkButton from "../link-button";
class Header extends Component {
  state = {
    currentTime: moment().format("YYYY-MM-DD hh:mm:ss"),
    dayPictureUrl: "", //天气图片url
    weather: "", //天气的文本
  };

  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = moment().format("YYYY-MM-DD hh:mm:ss");
      this.setState({ currentTime });
    }, 1000);
  };
  getWeather = async () => {
    // 调用接口请求异步获取数据
    const { weather } = await reqWeather(110101);
    this.setState({ weather });
  };
  getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname;
    let title;
    menuList.forEach((item) => {
      if (item.key === path) {
        // 如果当前item对象的key与path一样，item的title就是需要显示的title
        title = item.title;
      } else if (item.children) {
        // 在所有子Item中查找匹配的
        const cItem = item.children.find((cItem) => cItem.key === path);
        if (cItem) {
          title = cItem.title;
        }
      }
    });
    return title;
  };
  logOut = () => {
    // 显示确认框
    let that = this;
    Modal.confirm({
      content: "确定退出吗？",
      onOk() {
        //删除保存的user数据
        storageUtils.removeUser();
        memoryUtils.user = {};
        //跳转到login页面
        that.props.history.replace("/login");
      },
    });
  };
  /**
   * 第一次render之后执行一次
   * 一般在此执行异步操作：发ajax请求/启动定时器
   */
  componentDidMount() {
    // 获取当前的时间
    this.getTime();
    // 获取当前天气
    this.getWeather();
  }
  // 当前组件卸载之前调用
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const { currentTime, weather } = this.state;
    const username = memoryUtils.user.username;
    // 得到当前需要显得title
    const title = this.getTitle();
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton href="javascript:" onClick={this.logOut}>
            退出
          </LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src="https://tianqi.2345.com/favicon.ico" alt="weather" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
