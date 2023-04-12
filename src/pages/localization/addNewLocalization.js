import React, { Component } from "react";
import { Modal, Button, Space, Form, Input, Checkbox, Select } from "antd";
import api from "../../api/axios";
import { toast } from "react-toastify";
import ReactFlagsSelect from "react-flags-select";

import * as _ from "lodash";

const { Option } = Select;

class EditLocalization extends Component {
  state = {
    languageName: null,
    country: null,
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
      languageName: _.get(this.props.localization, "languageName", ""),
      country: _.get(this.props.localization, "country", ""),
    });
  }

  updateLocalizationById = async () => {
    this.setState({ ...this.state, submitting: true });
    let body;
    body = _.omit(this.state, ["submitting"]);

    const user = await api.put(
      `/admin/localizations/${this.props.localization.id}`,
      {
        ...body,
      }
    );
    toast.success("localization updated successfully!");
    this.props.toggleModal();
    this.props.fetchLocalizations();
    this.setState({ submitting: false });
  };

  createLocalization = async () => {
    this.setState({ ...this.state, submitting: true });
    const body = _.omit(this.state, ["submitting"]);
    const localization = await api.post(`/admin/localizations`, {
      ...body,
    });
    toast.success("localization created successfully!");
    this.props.toggleModal();
    this.props.fetchLocalizations();
    this.setState({ submitting: false });
  };

  render() {
    return (
      <Modal
        title={
          this.props.localization.languageName
            ? "Edit Localization"
            : "Create Localization"
        }
        centered
        visible={this.props.visible}
        footer={[]}
        width={1000}
        onCancel={this.props.toggleModal}
      >
        <Form
          initialValues={{
            languageName: _.get(this.props.localization, "languageName", ""),
            country: _.get(this.props.localization, "country", ""),
          }}
          onFinish={() => {
            if (this.props.localization.languageName) {
              this.updateLocalizationById();
            } else {
              this.createLocalization();
            }
          }}
        >
          <Form.Item
            label="LanguageName"
            name="languageName"
            rules={[{ required: true, message: "Please input languageName!" }]}
          >
            <Input onChange={this.handleChange("languageName")} />
          </Form.Item>
          <Form.Item label="country" name="country">
            <ReactFlagsSelect
              selected={this.state.country}
              onSelect={(code) => {
                this.setState({ country: code });
              }}
              searchable
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={this.state.submitting}
              loading={this.state.submitting}
            >
              {this.props.localization.languageName ? "Update" : "create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditLocalization;
