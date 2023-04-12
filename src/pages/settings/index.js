import React, { Component } from "react";
import api from "../../api/axios";
import {
  Modal,
  Button,
  Space,
  Form,
  Input,
  Checkbox,
  Select,
  Card,
} from "antd";
import * as _ from "lodash";
import { toast } from "react-toastify";

class Settings extends Component {
  state = {
    settings: {},
    submitting: false,
  };

  componentDidMount() {
    this.fetchSiteSettings();
  }

  fetchSiteSettings = async () => {
    const response = await api.get("/admin/settings");
    const settings = response.data.data.setting;

    if (settings) {
      this.setState({ settings });
    }
  };

  updateSettings = async () => {
    this.setState({ submitting: true });
    const response = await api.put("/admin/settings", { ...this.state });
    this.fetchSiteSettings();
    this.setState({ submitting: false });
    toast.success("settings updated");
  };
  handleChange = (key) => (e) => {
    this.setState({ ...this.state, [key]: e.target.value });
  };

  render() {
    return (
      <>
        <Card>
          <h1> Site Settings </h1>
          {this.state.settings.title && (
            <Form
              initialValues={{
                title: _.get(this.state.settings, "title", ""),
                description: _.get(this.state.settings, "description", ""),
                adminPercentage: _.get(
                  this.state.settings,
                  "adminPercentage",
                  ""
                ),
              }}
              onFinish={() => {
                this.updateSettings();
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
                label="description"
                name="description"
                rules={[
                  { required: true, message: "Please input description!" },
                ]}
              >
                <Input onChange={this.handleChange("description")} />
              </Form.Item>
              <Form.Item
                label="adminPercentage"
                name="adminPercentage"
                rules={[
                  { required: true, message: "Please input adminPercentage!" },
                ]}
              >
                <Input
                  onChange={this.handleChange("adminPercentage")}
                  type="number"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={this.state.submitting}
                  loading={this.state.submitting}
                >
                  Update settings
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </>
    );
  }
}

export default Settings;
