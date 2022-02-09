import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import { reqDeleteUser, reqUsers, reqAddOrUpdateUser } from "../../api/index";
import UserForm from "./user-form";
export default class User extends Component {
  constructor(props) {
    super(props);
    // this.user = {};
  }
  state = {
    users: [], // 所有用户列表
    roles: [], // 所有角色列表
    isShow: false, // 是否显示确认框
  };

  initColumns = () => {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username",
      },
      {
        title: "邮箱",
        dataIndex: "email",
      },

      {
        title: "电话",
        dataIndex: "phone",
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        render: formateDate,
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        render: (role_id) => this.roleNames[role_id],
      },
      {
        title: "操作",
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        ),
      },
    ];
  };

  /*
      根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
       */
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, []);
    // 保存
    this.roleNames = roleNames;
  };

  /*
      显示添加界面
       */
  showAdd = () => {
    this.user = null; // 去除前面保存的user
    this.setState({ isShow: true });
  };

  /*
      显示修改界面
       */
  showUpdate = (user) => {
    this.user = user; // 保存user
    this.setState({
      isShow: true,
    });
  };

  /*
      删除指定用户
       */
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if (result.status === 0) {
          message.success("删除用户成功!");
          this.getUsers();
        }
      },
    });
  };

  /*
      添加/更新用户
       */
  addOrUpdateUser = async () => {
    this.form.validateFields().then(async (values) => {
      // 隐藏弹窗
      this.setState({ isShow: false });
      // 1. 收集输入数据
      const user = values;
      // 如果是更新, 需要给user指定_id属性
      if (this.user) {
        user._id = this.user._id;
      }
      console.log(user, "user");
      console.log(this.form, "form");
      console.log(values, "values");
      // 2. 提交添加的请求
      const result = await reqAddOrUpdateUser(user);
      console.log(result, "result2");
      // 3. 更新列表显示
      if (result.status === 0) {
        message.success(`${this.user ? "修改" : "添加"}用户成功`);
        this.getUsers();
      } else {
        message.error(`${this.state.user._id ? "修改" : "添加"}角色失败`);
      }
    });
  };

  getUsers = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      const { users, roles } = result.data;
      this.initRoleNames(roles);
      this.setState({
        users,
        roles,
      });
    }
  };

  componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getUsers();
  }

  render() {
    const { users, roles, isShow } = this.state;
    const user = this.user || {};

    const title = (
      <Button type="primary" onClick={this.showAdd}>
        创建用户
      </Button>
    );
    console.log(this.form, "render form");
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={users}
          columns={this.columns}
          pagination={{ defaultPageSize: 2 }}
        />

        <Modal
          title={user._id ? "修改用户" : "添加用户"}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.setState({ isShow: false });
          }}
        >
          <UserForm
            setForm={(form) => (this.form = form)}
            roles={roles}
            user={user}
          />
        </Modal>
      </Card>
    );
  }
}

// import React, { Component } from "react";
// import { Card, Button, Table, Modal, message } from "antd";
// import { formateDate } from "../../utils/dateUtils";
// import LinkButton from "../../components/link-button/index";
// import { reqDeleteUser, reqUsers, reqAddOrUpdateUser } from "../../api/index";
// import UserForm from "./user-form";
//
// export default class Users extends Component {
//   state = {
//     users: [], //所有用户列表
//     showStatus: 0,
//     roles: [],
//     user: {},
//   };
//   constructor(props) {
//     super(props);
//     this.us = React.createRef();
//   }
//   initColumns = () => {
//     this.columns = [
//       {
//         title: "用户名",
//         dataIndex: "username",
//       },
//       {
//         title: "邮箱",
//         dataIndex: "email",
//       },
//       {
//         title: "电话",
//         dataIndex: "phone",
//       },
//       {
//         title: "注册时间",
//         dataIndex: "create_time",
//         render: (create_time) => formateDate(create_time),
//       },
//       {
//         title: "所属角色",
//         dataIndex: "role_id",
//         render: (role_id) => this.roleNames[role_id],
//       },
//       {
//         title: "操作",
//         render: (user) => (
//           <span>
//             <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
//             <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
//           </span>
//         ),
//       },
//     ];
//   };
//   /* 根据role数据,生成包含所有角色名的对象 */
//   initRoles = (roles) => {
//     this.roleNames = roles.reduce((pre, role) => {
//       pre[role._id] = role.name ? role.name : "";
//       return pre;
//     }, []);
//   };
//   /* 删除指定用户 */
//   deleteUser = (user) => {
//     Modal.confirm({
//       title: `确认删除${user.username}吗?`,
//
//       onOk: async () => {
//         const result = await reqDeleteUser(user._id);
//         if (result.status === 0) {
//           message.success("删除用户成功!");
//           this.getUsers();
//         } else {
//           message.error("删除用户失败!");
//         }
//       },
//     });
//   };
//   /* 获取用户列表 */
//   getUsers = async () => {
//     const result = await reqUsers();
//     if (result.status === 0) {
//       const { users, roles } = result.data;
//       this.initRoles(roles);
//       this.setState({ users, roles });
//     } else {
//       message.error("获取角色列表失败");
//     }
//   };
//   addOrUpdateuser = async () => {
//     //收集数据
//     let user = this.us.current.addOrUpdateUser();
//     user.create_time = Date.now();
//     if (this.state.user._id) {
//       user._id = this.state.user._id;
//     }
//     //   2.提交添加的请求
//     const result = await reqAddOrUpdateUser(user);
//     // 3.更新列表显示
//     if (result.status === 0) {
//       message.success(`${this.state.user._id ? "修改" : "添加"}角色成功`);
//       this.getUsers();
//       this.setState({ showStatus: 0 });
//     } else {
//       message.error(`${this.state.user._id ? "修改" : "添加"}角色失败`);
//     }
//     // //console.log(user);
//   };
//   showUpdate = (user) => {
//     this.setState({ showStatus: 1, user: user });
//   };
//   UNSAFE_componentWillMount() {
//     this.initColumns();
//   }
//   componentDidMount() {
//     this.getUsers();
//   }
//   handleCancel = () => {
//     this.setState({ showStatus: 0 });
//   };
//   render() {
//     const { users, showStatus, roles } = this.state;
//     ////console.log(users);
//     const title = (
//       <Button
//         type="primary"
//         onClick={() => {
//           this.setState({ showStatus: 1, user: {} });
//         }}
//       >
//         创建用户
//       </Button>
//     );
//     return (
//       <Card title={title}>
//         <Table
//           rowKey="_id"
//           pagination={{
//             pageSize: 5,
//             // , total: 50
//           }}
//           dataSource={users}
//           columns={this.columns}
//           bordered
//         />
//         <Modal
//           title={this.state.user._id ? "修改用户" : "添加用户"}
//           visible={showStatus === 1}
//           onOk={this.addOrUpdateuser}
//           onCancel={this.handleCancel}
//           destroyOnClose={true}
//         >
//           <UserForm roles={roles} ref={this.us} user={this.state.user} />
//         </Modal>
//       </Card>
//     );
//   }
// }
