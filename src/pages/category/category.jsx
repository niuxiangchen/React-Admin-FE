import React, { Component } from "react";
import { Card, Table, Button, message, Modal } from "antd";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";
import LinkButton from "../../components/link-button";
import {
  reqCategorys,
  reqUpdateCategorys,
  reqAddCategorys,
} from "../../api/index";
import AddForm from "./add-form";
import UpdateForm from "./update-form";
class Category extends Component {
  state = {
    loading: false, // 是否正在获取数据中
    categorys: [], // 一级分类列表
    subCategorys: [], //二级分类列表
    parentId: "0", // 当前需要显示的分类列表的父分类Id
    parentName: "", //当前需要显示的分类列表的父分类Name
    showStatus: 0, //标识添加/更新确认框是否显示，0:都不显示 1:显示添加 2:显示更新
  };

  // 初始化Table所有列的数组
  initColumns = () => {
    this.columns = [
      {
        title: "分类的名称",
        dataIndex: "name", //指定数据对应的属性名
      },
      {
        title: "操作",
        width: 300,
        render: (category) => (
          //返回需要显示的界面标签
          <span>
            <LinkButton
              onClick={() => {
                this.showUpdate(category);
              }}
            >
              修改分类
            </LinkButton>
            {this.state.parentId === "0" ? (
              <LinkButton
                onClick={() => {
                  this.showSubCategorys(category);
                }}
              >
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        ),
      },
    ];
  };
  // 异步获取一级分类列表显示
  getCategorys = async () => {
    // 在发请求前显示loading
    this.setState({ loading: true });
    const { parentId } = this.state;
    // 发异步ajax请求获取数据
    const result = await reqCategorys(parentId);
    this.setState({ loading: false });
    if (result.status === 0) {
      // 取出分类数组(可能是一级也可能是二级的)
      const categorys = result.data;
      const subCategorys = result.data;
      if (parentId === "0") {
        this.setState({ categorys }); //更新一级分类状态
      } else {
        this.setState({ subCategorys }); //更新二级分类状态
      }
    } else {
      message.error("获取分类列表失败");
    }
  };
  // 显示指定一级分类对象的二子列表
  showSubCategorys = (category) => {
    // 更新状态
    this.setState(
      {
        parentId: category._id,
        parentName: category.name,
      },
      // 在状态更新且重新render后执行
      () => {
        // 获取二级分类列表显示
        this.getCategorys();
      }
    );
  };
  // 显示一级分类列表
  showCategorys = () => {
    // 更新为显示一级列表的状态
    this.setState({
      parentId: "0",
      parentName: "",
      subCategorys: [],
    });
  };
  // 响应点击取消：隐藏确定框
  handleCancel = () => {
    this.setState({
      showStatus: 0,
    });
  };
  // 显示添加modal
  showAdd = () => {
    this.setState({ showStatus: 1 });
  };
  // 显示更新modal
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category;
    this.setState({ showStatus: 2 });
  };
  // 添加分类
  addCategory = async () => {
    this.form
      .validateFields()
      .then(async (values) => {
        // 1.隐藏弹框
        this.setState({
          showStatus: 0,
        });
        // 2.收集数据，发送请求
        const { parentId, categoryName } = values;
        // console.log(parentId);
        // console.log(categoryName);
        const result = await reqAddCategorys(categoryName, parentId);
        if (result.status === 0) {
          // 3.重新显示列表
          if (parentId === this.state.parentId) {
            // 如果添加的是当前分类下的列表，则刷新，其他分类的不刷新
            this.getCategorys();
          } else if (parentId === "0") {
            // 在二级分类列表下添加一级分类，重新获取一级分类列表，但不需要显示
            this.getCategorys("0");
          }
        }
      })
      .catch((err) => {
        //console.log(err);
        message.info("请输入分类名称");
      });
  };
  // 更新分类
  updateCategory = () => {
    //进行表单验证，只有通过了才处理
    this.form
      .validateFields()
      .then(async (values) => {
        //1.隐藏确认框
        this.setState({
          showStatus: 0,
        });

        //准备数据
        const categoryId = this.category._id;
        // const categoryName = this.form.getFieldValue('categoryName')
        const { categoryName } = values;
        //清除输入数据
        this.form.resetFields();
        //2.发送请求更新分类
        const result = await reqUpdateCategorys(categoryId, categoryName);
        if (result.status === 0) {
          //3.重新显示列表
          this.getCategorys();
        }
      })
      .catch((err) => {
        message.info("请输入分类名称");
      });
  };
  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    // 发异步ajax请求
    this.getCategorys(); //获取一级分类
  }
  render() {
    // 读取状态数据
    const {
      categorys,
      loading,
      subCategorys,
      parentId,
      parentName,
      showStatus,
    } = this.state;
    const { columns } = this;
    const category = this.category || {}; //如果还没有 指定一个空对象
    // Card的右侧
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
          <ArrowRightOutlined />
          <span>{parentName}</span>
        </span>
      );
    // Card的右侧
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <PlusOutlined />
        添加
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered={true}
          rowKey="_id"
          loading={loading}
          dataSource={parentId === "0" ? categorys : subCategorys}
          columns={columns}
          pagination={{ defaultPageSize: 5 }}
        />
        <Modal
          title="添加分类"
          visible={showStatus === 1 ? true : false}
          onOk={this.addCategory}
          destroyOnClose={true}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => {
              this.form = form;
            }}
          />
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus === 2 ? true : false}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={(form) => {
              this.form = form;
            }}
          />
        </Modal>
      </Card>
    );
  }
}

export default Category;
