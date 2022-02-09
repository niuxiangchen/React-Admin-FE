import React, { Component } from "react";
import {
  List,
  Card,
  Form,
  Input,
  Cascader,
  Upload,
  Button,
  message,
} from "antd";
import LinkButton from "../../components/link-button";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { reqAddOrUpdateProduct, reqCategorys } from "../../api";
import PicturesWall from "./pictures-wall";
import RichTextEditor from "./rich-text-editor";
import detail from "./detail";
/**
 * Product的添加和更新的子路由组件
 */
const { Item } = Form;
const { TextArea } = Input;
class ProductAddUpdate extends Component {
  state = {
    options: [],
  };

  constructor(props) {
    super(props);
    // 创建用来保存ref标识的标签对象容器
    this.pw = React.createRef();
    this.editor = React.createRef();
  }
  onFinish = async (values) => {
    // 1.收集数据,并封装成product对象
    const { name, desc, price, categoryIds } = values;
    let pCategoryId, categoryId;
    // 数组里只有一个说明是一级分类
    if (categoryIds.length === 1) {
      pCategoryId = "0";
      categoryId = categoryIds[0];
    } else {
      pCategoryId = categoryIds[0];
      categoryId = categoryIds[1];
    }
    const imgs = this.pw.current.getImgs();
    const detail = this.editor.current.getDetail();
    const product = {
      name,
      desc,
      price,
      imgs,
      detail,
    };
    // 如果是更新，需要添加id
    if (this.isUpdate) {
      product._id = this.product._id;
    }
    // 2.调用接口请求函数去添加/更新
    const result = await reqAddOrUpdateProduct(product);
    // 3.根据结果提示
    if (result.status === 0) {
      message.success(`${this.isUpdate ? "更新" : "添加"}商品成功`);
      this.props.history.goBack();
    } else {
      message.error(`${this.isUpdate ? "更新" : "添加"}商品失败`);
    }
  };
  onFinishFailed = () => {};
  // 验证价格的自定义验证函数
  validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback(); //验证通过
    } else {
      callback("价格必须大于0"); //验证没通过
    }
  };
  // 用于加载下一级列表的回调函数
  loadData = async (selectedOptions) => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0];
    // 显示loading
    targetOption.loading = true;
    // 根据选中的分类，请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value);
    // 隐藏loading
    targetOption.loading = false;
    if (subCategorys && subCategorys.length > 0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      // 关联到当前option上
      targetOption.children = childOptions;
    } else {
      // 当前选中的分类没有二级分类
      targetOption.isLeaf = true;
    }
    // 更新options状态
    this.setState({
      options: [...this.state.options],
    });
  };
  initOptions = async (categorys) => {
    // 根据categories数组生成options数组
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }));
    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this;
    const { pCategoryId, categoryID } = product;
    if (isUpdate && pCategoryId !== "0") {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      // 生成二级下拉列表的Options
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      // 找到当前商品对应的一级option对象
      const targetOption = options.find(
        (option) => option.value === pCategoryId
      );
      // 关联到对应的一级option
      targetOption.children = childOptions;
    }
    // 更新options状态
    this.setState({
      options,
    });
  };
  // 异步获取一级/二级分类列表，并显示
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId); // {status:0,data:categorys }
    if (result.status === 0) {
      const categorys = result.data;
      // 如果是一级分类列表
      if (parentId === 0) {
        this.initOptions(categorys);
      } else {
        // 二级列表
        return categorys; // 返回二级列表 ==> 当前async函数返回的promise就会成功且value为categorys
      }
    }
  };

  componentDidMount() {
    this.getCategorys(0);
  }
  componentWillMount() {
    // 取出携带的state
    const product = this.props.location.state; // 如果是添加没值，否则有值
    // 保存是否是更新的标识
    this.isUpdate = !!product; // !!强制转换弱类型
    // 保存商品（如果没有则设为空对象）
    this.product = product || {};
  }
  render() {
    const { isUpdate, product } = this;
    const { pCategoryId, categoryId, detail } = product;
    const { loadData } = this;
    // 用来接受级联分类ID的数组
    const categoryIds = [];
    if (isUpdate) {
      // 商品是一个一级分类的商品
      if (pCategoryId === 0) {
        categoryIds.push(categoryId);
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }
    }
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 2 }, //左侧label宽度
      wrapperCol: { span: 8 }, // 右侧包裹的宽度
    };
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <ArrowLeftOutlined
            style={{
              color: "blue",
              marginRight: 10,
              fontSize: 18,
            }}
          />
        </LinkButton>
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    );
    return (
      <Card title={title}>
        <Form
          {...formItemLayout}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          initialValues={{
            name: product.name,
            desc: product.desc,
            price: product.price,
            categoryIds: categoryIds,
          }}
        >
          <Item
            label="商品名称"
            name="name"
            rules={[{ required: true, message: "必须输入商品名称" }]}
          >
            <Input placeholder="商品名称"/>
          </Item>
          <Item
            label="商品描述"
            name="desc"
            rules={[{ required: true, message: "必须输入商品描述" }]}
          >
            <TextArea
              placeholder="请输入商品描述"
              autosize={{ minRows: 2, maxRows: 6 }}
            />
          </Item>
          <Item
            label="商品价格"
            name="price"
            rules={[
              {
                required: true,
                message: "必须输入商品价格",
                validator: this.validatePrice,
              },
            ]}
          >
            <Input type="number" placeholder="商品价格" addonAfter="元"/>
          </Item>
          <Item
            label="商品分类"
            name="categoryIds"
            rules={[
              {
                required: true,
                message: "必须指定商品分类",
                // validator: this.validatePrice,
              },
            ]}
          >
            <Cascader
              placeholder="请指定商品分类"
              options={this.state.options} // 需要显示的列表数据数组
              loadData={loadData} //当选择某个列表项，加载下一级列表的监听回调
            />
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={this.imgs} />
          </Item>
          <Item
            label="商品详情"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
          >
            <RichTextEditor ref={this.editor} detail={detail} />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}

export default ProductAddUpdate;
