import { Card, Select, Input, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { Component } from "react";
const Option = Select.Option;
/**
 * Product的默认子路由组件
 */
class ProductHome extends Component {
  render() {
    const title = (
      <span>
        <Select defaultValue="1" style={{ width: 150 }}>
          <Option value="1">按名称搜索</Option>
          <Option value="2">按描述搜索</Option>
        </Select>
        <Input placeholder="关键字" style={{ width: 150, margin: "0 15px" }} />
        <Button type="primary">搜索</Button>
      </span>
    );
    const extra = (
      <Button type="primary">
        <PlusOutlined />
        {" 添加商品"}
      </Button>
    );
    return <Card title={title} extra={extra}></Card>;
  }
}

export default ProductHome;
