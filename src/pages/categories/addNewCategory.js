import React, { Component } from "react";
import {
  Modal,
  Button,
  Space,
  Form,
  Input,
  Checkbox,
  Select,
  Upload,
} from "antd";
import api from "../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";

import * as _ from "lodash";

const { Option } = Select;
class EditUser extends Component {
  state = {
    title: null,
    description: null,
    thumbnail: "",
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
      title: _.get(this.props.category, "title", ""),
      description: _.get(this.props.category, "description", ""),
      thumbnail: _.get(this.props.category, "thumbnail", ""),
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
    const user = await api.put(`/admin/categories/${this.props.category.id}`, {
      ...body,
    });
    toast.success("category updated successfully!");
    this.props.toggleModal();
    this.props.fetchCategory();
    this.setState({ ...this.state, submitting: false });
  };

  createCategory = async () => {
    this.setState({ ...this.state, submitting: true });
    const body = _.omit(this.state, ["submitting"]);
    const category = await api.post(`/admin/categories`, {
      ...body,
    });
    toast.success("category created successfully!");
    this.props.toggleModal();
    this.props.fetchCategory();
    this.setState({ ...this.state, submitting: false });
  };

  render() {
    return (
      <Modal
        title={this.props.category.title ? "Edit category" : "Create Category"}
        centered
        visible={this.props.visible}
        footer={[]}
        width={1000}
        onCancel={this.props.toggleModal}
      >
        <Form
          initialValues={{
            title: _.get(this.props.category, "title", ""),
            description: _.get(this.props.category, "description", ""),
            thumbnail: _.get(this.props.category, "thumbnail", ""),
          }}
          onFinish={() => {
            if (this.props.category.title) {
              this.updateUserById();
            } else {
              this.createCategory();
            }
          }}
        >
          <Form.Item
            label="title"
            name="title"
            rules={[{ required: true, message: "Please input title!" }]}
          >
            <Input onChange={this.handleChange("title")} />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input onChange={this.handleChange("description")} />
          </Form.Item>
          <Form.Item
            name="thumbnail"
            label="Thumbnail"
            rules={[{ required: true, message: "Please Upload Thumbnail" }]}
          >
            <Upload
              name="logo"
              method="PUT"
              action={async (file) => {
                try {
                  const splitFIle = file.name.split(".");
                  const extension = splitFIle[splitFIle.length - 1];

                  const response = await api.post("/uploads/image", {
                    filename: file.name,
                    type: "resource",
                    folder: `resource-website`,
                    extension,
                  });
                  return response.data;
                } catch (Err) {
                  // message.error("error in uploading!!");
                }
              }}
              customRequest={(options) => {
                const { file } = options;
                axios({
                  url: options.action,
                  method: "put",
                  headers: {
                    "Content-Type": file.type,
                  },
                  data: file,
                })
                  .then((data) => {
                    let value = data.config.url;
                    const index = value.indexOf("?");
                    value = value.substring(0, index);
                    this.setState({
                      ...this.state,
                      thumbnail: options.action.split("?")[0],
                    });
                  })
                  .then(() => {
                    options.onSuccess();
                  })
                  .catch((err) => {
                    toast.error("failed to upload!");
                  });
              }}
              // onChange={(info) => {
              //   const { status } = info.file;
              //   const { file } = info;
              //   console.log("file===", file);
              //   if (status === "done") {
              //     this.setState({
              //       ...this.state,
              //       thumbnail: file.xhr.responseURL.split("?")[0],
              //     });
              //   }
              // }}
              maxCount="1"
              accept=".png,.jpg,.PNG,.JPEG,.JPG,.jpeg"
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          {this.state.thumbnail && (
            <img src={this.state.thumbnail} height="100" width="100" />
          )}
          <br />
          <hr />
          <hr />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={this.state.submitting}
              loading={this.state.submitting}
            >
              {this.props.category.title ? "Update" : "create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditUser;
