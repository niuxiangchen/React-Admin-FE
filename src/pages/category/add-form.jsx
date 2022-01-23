import React, { Component } from "react";
import { Form, Select, Input } from "antd";
const Item = Form.Item;
const Option = Select.Option;
// 添加分类的form组件
class AddForm extends Component {
  render() {
    return (
      <Form>
        <Item>
          <Select defaultValue="0">
            <Option value="0">一级分类</Option>
            <Option value="1">电脑</Option>
            <Option value="2">图书</Option>
          </Select>
        </Item>
        <Item>
          <Input defaultValue="" placeholder="请输入分类名称" />
        </Item>
      </Form>
    );
  }
}

export default AddForm;
