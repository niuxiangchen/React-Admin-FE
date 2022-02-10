import { Card, Select, Input, Button, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { Component } from "react";
import LinkButton from "../../components/link-button";
import { reqProducts, reqSearchProducts, reqUpdateStatus } from "../../api";
import { PAGE_SIZE } from "../../utils/constant";
const Option = Select.Option;
/**
 * Product的默认子路由组件
 */
class ProductHome extends Component {
  state = {
    total: 0, // 商品的总数量
    products: [], //商品的数组
    loading: false, // 是否正在加载中
    searchName: "", //搜素的关键字
    searchType: "productName", // 根据那个字段搜索
  };
  // 初始化table的列的数组
  initColumns = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name",
      },
      {
        title: "商品描述",
        dataIndex: "desc",
      },
      {
        title: "价格",
        dataIndex: "price",
        render: (price) => "￥" + price, // 当前指定了对应的属性，传入的是对应的属性值
      },
      {
        width: 100,
        title: "状态",
        // dataIndex: "status",
        render: (product) => {
          const { status, _id } = product;
          return (
            <span>
              <Button
                type="primary"
                onClick={() => this.updataStatus(_id, status === 1 ? 2 : 1)}
              >
                {status === 1 ? "下架" : "上架"}
              </Button>
              <span>{status === 1 ? "在售" : "已下架"}</span>
            </span>
          );
        },
      },
      {
        width: 100,
        title: "操作",
        render: (product) => {
          return (
            <span>
              {/* 将product对象作为state传给目标路由组件 */}
              <LinkButton
                onClick={() =>
                  this.props.history.push("/product/detail", { product })
                }
              >
                详情
              </LinkButton>
              <LinkButton
                onClick={() =>
                  this.props.history.push("/product/addupdate", product)
                }
              >
                修改
              </LinkButton>
            </span>
          );
        },
      },
    ];
  };
  // 获取指定页码的列表
  getProducts = async (pageNum) => {
    this.pageNum = pageNum; // 保存pageNum
    this.setState({ loading: true }); //显示loading
    const { searchName, searchType } = this.state;
    // 如果搜索关键字有值，说明我们要做搜索分页
    let result;
    if (searchName) {
      result = await reqSearchProducts({
        pageNum,
        pageSize: PAGE_SIZE,
        searchName,
        searchType,
      });
    } else {
      // 一般分页请求
      result = await reqProducts(pageNum, PAGE_SIZE);
    }
    this.setState({ loading: false }); //请求结束隐藏loading
    if (result.status === 0) {
      // 取出分页数据，更新状态，显示分页列表
      const { total, list } = result.data;
      // 更新状态
      this.setState({
        total,
        products: list,
      });
    }
  };
  // 更新指定商品的状态
  updataStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status);
    if (result.status === 0) {
      message.success("更新商品成功");
      this.getProducts(this.pageNum);
    }
  };
  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getProducts(1);
  }
  render() {
    // 取出状态数据
    const { products, total, loading, searchName, searchType } = this.state;
    const title = (
      <span>
        <Select
          defaultValue="productName"
          style={{ width: 150 }}
          onChange={(value) => this.setState({ searchType: value })}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          style={{ width: 150, margin: "0 15px" }}
          value={searchName}
          onChange={(event) =>
            this.setState({ searchName: event.target.value })
          }
        />
        <Button type="primary" onClick={() => this.getProducts(1)}>
          搜索
        </Button>
      </span>
    );
    const extra = (
      <Button
        type="primary"
        onClick={() => this.props.history.push("/product/addupdate")}
      >
        <PlusOutlined />
        {" 添加商品"}
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          loading={loading}
          rowKey="_id"
          dataSource={products}
          columns={this.columns}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            total: total,
            showQuickJumper: true,
            onChange: this.getProducts,
          }}
        />
      </Card>
    );
  }
}

export default ProductHome;
