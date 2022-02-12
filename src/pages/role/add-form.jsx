import React, { Component } from "react";
import { Form, Select, Input } from "antd";
import PropTypes from "prop-types";
const Item = Form.Item;
// 添加角色的form组件
class AddForm extends Component {
  formRef = React.createRef();
  static propTypes = {
    setForm: PropTypes.func,
  };
  componentDidMount() {
    this.props.setForm(this.formRef.current);
  }
  render() {
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 }, //左侧label宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    };
    return (
      <Form ref={this.formRef}>
        <Item
          {...formItemLayout}
          label="角色名称"
          name="roleName"
          rules={[{ required: true, message: "请输入角色名称" }]}
        >
          <Input placeholder="请输入角色名称" />
        </Item>
      </Form>
    );
  }
}

export default AddForm;
