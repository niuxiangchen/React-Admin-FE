import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { PAGE_SIZE } from "../../utils/constant";
import { reqAddRole, reqRoles, reqUpdateRole } from "../../api";
import AddForm from "./add-form";
import { formateDate } from "../../utils/dateUtils";
import storageUtils from "../../utils/storageUtils";
import AuthForm from "./auth-form";
import { connect } from "react-redux";
import { logout } from "../../redux/action";
class Role extends Component {
  state = {
    roles: [], //所有角色的列表
    role: {}, // 选中的role
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false, // 是否显示设置权限界面
  };
  constructor(props) {
    super(props);
    this.auth = React.createRef();
  }
  initColumn = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: (create_time) => formateDate(create_time),
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: formateDate,
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
      },
    ];
  };
  getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      const roles = result.data;
      this.setState({
        roles,
      });
    }
  };
  onRow = (role) => {
    return {
      onClick: (event) => {
        //点击行
        // alert("点击行");
        this.setState({
          role,
        });
      },
    };
  };
  // 添加角色
  addRole = async () => {
    // 进行表单验证，只能通过了才向下处理
    this.form.validateFields().then(async (values) => {
      // 隐藏弹窗
      this.setState({
        isShowAdd: false,
      });
      // 收集输入数据
      const { roleName } = values;
      // 请求添加
      const result = await reqAddRole(roleName);

      // 根据结果提示/更新列表显示
      if (result.status === 0) {
        message.success("添加角色成功");
        // 新产生的角色
        const role = result.data;
        // 更新roles状态
        const roles = this.state.roles;
        this.setState({
          roles: [role, ...roles],
        });
      } else {
        message.error("添加角色失败");
      }
    });
    // 根据结果提示/更新列表显示
  };
  //更新角色
  updateRole = async () => {
    // 隐藏确认框
    this.setState({
      isShowAuth: false,
    });

    const role = this.state.role;
    // 得到最新的menus
    const menus = this.auth.current.getMenus();
    role.menus = menus;
    role.auth_time = Date.now();
    role.auth_name = this.props.user.username;

    // 请求更新
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      // this.getRoles()
      // 如果当前更新的是自己角色的权限, 强制退出
      if (role._id === this.props.user.role_id) {
        this.props.user.logout();
        message.success("当前用户角色权限成功");
      } else {
        message.success("设置角色权限成功");
        this.setState({
          roles: [...this.state.roles],
        });
      }
    }
  };
  componentWillMount() {
    this.initColumn();
  }
  componentDidMount() {
    this.getRoles();
  }
  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state;
    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => {
            this.setState({ isShowAdd: true });
          }}
        >
          创建角色
        </Button>
        &nbsp; &nbsp;
        <Button
          type="primary"
          disabled={!role._id}
          onClick={() => {
            this.setState({ isShowAuth: true });
          }}
        >
          设置角色权限
        </Button>
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
          rowSelection={{
            type: "radio",
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              this.setState({ role });
            },
          }}
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          destroyOnClose={true}
          onCancel={() => {
            this.setState({
              isShowAdd: false,
            });
          }}
        >
          <AddForm
            roles={roles}
            setForm={(form) => {
              this.form = form;
            }}
          />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          destroyOnClose={true}
          onCancel={() => {
            this.setState({
              isShowAuth: false,
            });
          }}
        >
          <AuthForm
            ref={this.auth}
            role={role}
            setForm={(form) => {
              this.form = form;
            }}
          />
        </Modal>
      </Card>
    );
  }
}

export default connect((state) => ({ user: state.user }), { logout })(Role);
