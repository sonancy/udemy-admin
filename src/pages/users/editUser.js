import React, { Component } from "react";
import { Modal, Button, Space, Form, Input, Checkbox, Select } from "antd";
import api from "../../api/axios";
import { toast } from "react-toastify";

import * as _ from "lodash";

const { Option } = Select;
class EditUser extends Component {
  state = {
    email: null,
    password: null,
    is_instructor: false,
    is_admin: false,
    first_name: null,
    last_name: null,
    username: null,
    status: null,
    submitting: false,
  };
  handleChange = (key) => (e) => {
    this.setState({ ...this.state, [key]: e.target.value });
  };

  handleDatePickerChange = (key) => (e, dateString) => {
    this.setState({ ...this.state, [key]: dateString });
  };

  handleOnCheckBoxChange = (key) => (e) => {
    this.setState({
      ...this.state,
      [key]: e.target.checked,
    });
  };

  handleDropDownChange = (key) => (value) => {
    this.setState({ ...this.state, [key]: value });
  };
  componentDidMount() {
    this.setState({
      email: _.get(this.props.user, "email", ""),
      password: _.get(this.props.user, "password", ""),
      isAuthor: _.get(this.props.user, "isAuthor", false),
      isAdmin: _.get(this.props.user, "isAdmin", false),
      firstName: _.get(this.props.user, "firstName", ""),
      lastName: _.get(this.props.user, "lastName", ""),
      username: _.get(this.props.user, "username", ""),
      status: _.get(this.props.user, "status", ""),
    });
  }

  updateUserById = async () => {
    this.setState({ ...this.state, submitting: true });
    let body;
    if (this.state.password) {
      body = _.omit(this.state, ["submitting"]);
    } else {
      body = _.omit(this.state, ["password", "submitting"]);
    }
    const user = await api.put(`/admin/users/${this.props.user.id}`, {
      ...body,
    });
    toast.success("user updated successfully!");
    this.props.toggleModal();
    this.props.fetchUser();
    this.setState({ ...this.state, submitting: false });
  };

  render() {
    return (
      <Modal
        title="Edit User"
        centered
        visible={this.props.visible}
        footer={[]}
        width={1000}
        onCancel={this.props.toggleModal}
      >
        <Form
          initialValues={{
            email: _.get(this.props.user, "email", ""),
            password: _.get(this.props.user, "password", ""),
            isAuthor: _.get(this.props.user, "isAuthor", false),
            isAdmin: _.get(this.props.user, "isAdmin", false),
            firstName: _.get(this.props.user, "firstName", ""),
            lastName: _.get(this.props.user, "lastName", ""),
            username: _.get(this.props.user, "username", ""),
            status: _.get(this.props.user, "status", ""),
          }}
          onFinish={() => {
            this.updateUserById();
          }}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please input FirstName!" }]}
          >
            <Input onChange={this.handleChange("firstName")} />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please input lastName!" }]}
          >
            <Input onChange={this.handleChange("lastName")} />
          </Form.Item>
          <Form.Item
            label="email"
            name="email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input onChange={this.handleChange("email")} />
          </Form.Item>
          <Form.Item label="password" name="password">
            <Input onChange={this.handleChange("password")} />
          </Form.Item>
          <Form.Item
            label="username"
            name="username"
            rules={[{ required: true, message: "Please input username!" }]}
          >
            <Input onChange={this.handleChange("username")} />
          </Form.Item>
          <Form.Item
            label="status"
            name="status"
            rules={[{ required: true, message: "Please Select Status!" }]}
          >
            <Select
              showSearch
              style={{ width: 400 }}
              placeholder="Select a person"
              onChange={this.handleDropDownChange("status")}
              value={this.state.status}
            >
              <Option value="active">active</Option>
              <Option value="pending">pending</Option>
              <Option value="suspended">suspended</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={this.state.submitting}
              loading={this.state.submitting}
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditUser;
