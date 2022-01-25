import React, { Component } from "react";
import { Form, Select, Input } from "antd";
import PropTypes from "prop-types";
const Item = Form.Item;
const Option = Select.Option;
// 添加分类的form组件
class UpdateForm extends Component {
  formRef = React.createRef();
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired,
  };
  componentDidMount() {
    //console.log(this.formRef);
    this.props.setForm(this.formRef.current);
  }
  render() {
    const { categoryName } = this.props;
    return (
      <Form ref={this.formRef}>
        <Form.Item
          name="categoryName"
          initialValue={categoryName}
          rules={[{ required: true, message: "分类名称必须输入" }]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>
      </Form>
    );
  }
}

export default UpdateForm;
