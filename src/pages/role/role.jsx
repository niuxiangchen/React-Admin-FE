import React, { Component } from "react";
import { Card, Button, Table } from "antd";
import { PAGE_SIZE } from "../../utils/constant";
class Role extends Component {
  state = {
    roles: [],
  };
  initColumn = () => {
    this.columns = [
      { title: "角色名称", dataIndex: "name" },
      { title: "创建时间", dataIndex: "create_time" },
      { title: "授权时间", dataIndex: "auth_time" },
      { title: "授权人", dataIndex: "auth_name" },
    ];
  };
  onRow = (role) => {
    return {
      onClick: (event) => {
        //点击行
        alert("点击行");
      },
    };
  };
  componentWillMount() {
    this.initColumn();
  }
  render() {
    const { roles } = this.state;
    const title = (
      <span>
        <Button type="primary">创建角色</Button>
        &nbsp; &nbsp;
        <Button type="primary">设置角色权限</Button>
      </span>
    );
    return (
      <Card title={title}>
        <Table
          bordered={true}
          rowKey="_id"
          // loading={loading}
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          rowSelection={{ type: "radio" }}
        />
      </Card>
    );
  }
}

export default Role;
