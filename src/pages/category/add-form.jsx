import React, { Component } from "react";
import { Form, Select, Input } from "antd";
import PropTypes from "prop-types";
const Item = Form.Item;
const Option = Select.Option;
// 添加分类的form组件
class AddForm extends Component {
  formRef = React.createRef();
  static propTypes = {
    categorys: PropTypes.array.isRequired, // 一级分类的数组
    parentId: PropTypes.string.isRequired, // 父分类的ID
    setForm: PropTypes.func,
  };
  componentDidMount() {
    this.props.setForm(this.formRef.current);
  }
  render() {
    const { categorys, parentId } = this.props;
    {
      console.log("====================================");
      console.log(categorys);
      console.log("====================================");
    }
    return (
      <Form ref={this.formRef}>
        <Item name="parentId" initialValue={parentId}>
          <Select>
            <Option value="0">一级分类</Option>
            {categorys.map((item) => {
              //console.log(item._id);
              return (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Item>
        <Item
          name="categoryName"
          rules={[{ required: true, message: "请输入分类名称" }]}
        >
          <Input placeholder="请输入分类名称" />
        </Item>
      </Form>
    );
  }
}

export default AddForm;
