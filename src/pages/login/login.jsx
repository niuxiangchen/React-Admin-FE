import React, { Component } from "react";
import "./login.less";
import logo from "./images/logo.png";
import { Form, Input, Button, message } from "antd";
import { reqLogin, reqAddUser } from "../../api/index";

// 登录的路由组件
class login extends Component {
  // 函数里接收一个参数，该参数就是返回的表单值
  onFinish = async (values) => {
    const { username, password } = values;
    // reqLogin(username, password)
    //   .then((response) => {
    //     console.log("====================================");
    //     console.log("成功了", response.data);
    //     console.log("====================================");
    //   })
    //   .catch((error) => {
    //     console.log("====================================");
    //     console.log("失败了", error);
    //     console.log("====================================");
    //   });

    const response = await reqLogin(username, password);
    const result = response.data;
    if (result.status === 0) {
      //登录成功
      message.success("登录成功");
      // 跳转到后台管理界面(不需要再回退到登录界面)
      this.props.history.replace(`/`);
    } else {
      //登录失败
      // 提示错误信息
      message.error(result.msg);
    }
  };
  onFinishFailed = (errorInfo) => {
    console.log("检验失败", errorInfo);
  };
  // 对密码进行自定义验证
  validatePwd = (rule, value) => {
    if (!value) {
      return Promise.reject("密码必须输入");
    } else if (value.length < 4) {
      return Promise.reject("密码长度不能小于4");
    } else if (value.length > 12) {
      return Promise.reject("密码长度不能大于12");
    } else if (!/^[a-zA-Z0-9_]+$/) {
      return Promise.reject("密码必须是英文、数字或下划线组成");
    } else {
      return Promise.resolve("通过"); //验证通过
    }
  };
  render() {
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            autoComplete="off"
            className="login-form"
          >
            <Form.Item
              label="账号"
              name="username"
              // 声明式验证：直接使用别人定义好的验证规则进行验证
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "用户名必须输入",
                },
                {
                  min: 4,
                  message: "用户名至少4位",
                },
                {
                  max: 12,
                  message: "用户名最多12位",
                },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "用户名必须是英文、数字或下划线组成",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  // message: "请输入密码",
                  validator: this.validatePwd,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}

export default login;
