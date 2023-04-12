import React, { Component } from "react";
import { Modal, Button } from "antd";
import {
  Input,
  Form,
  Select,
  Upload,
  Image,
  DatePicker,
  Checkbox,
  message,
} from "antd";
import { toast } from "react-toastify";
// Form Editor
import RichTextEditor from "react-rte";
import base from "../../api/points";
import api from "../../api/axios";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromRaw,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import * as _ from "lodash";
import decode from "decode-html";

class AddNewPage extends Component {
  state = {
    content: EditorState.createEmpty(),
    title: null,
    description: null,
    isAvailable: true,
    submitting: false,
  };

  /***
   * 
   * EditorState.createWithContent(
      ContentState.createFromBlockArray(
        htmlToDraft("<h1>Hello world</h1>").contentBlocks
      )
    )
   */

  onChange = (value) => {
    this.setState({ content: value });
    if (this.props.onChange) {
      this.props.onChange(value.toString("html"));
    }
  };

  handleValidSubmit = async () => {
    this.setState({ submitting: true });
    const convertedState = convertToRaw(this.state.content.getCurrentContent());
    const response = await api.post(base.pages, {
      title: this.state.title,
      description: this.state.description,
      content: draftToHtml(convertedState),
      isAvailable: this.state.isAvailable,
    });
    this.props.fetchPages();
    this.setState({ submitting: false });
    this.props.toggleVisible();
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

  onEditorStateChange = (editorState) => {
    this.setState({
      content: editorState,
    });
  };

  componentDidMount() {
    const state = {
      title: _.get(this.props.page, "title", ""),
      description: _.get(this.props.page, "description", ""),
      isAvailable: _.get(this.props.page, "isAvailable", false),
    };
    const content = EditorState.createWithContent(
      ContentState.createFromBlockArray(
        htmlToDraft(
          decode(_.get(this.props.page, "content", "<h1>Edit me</h1>"))
        ).contentBlocks
      )
    );

    this.setState({ content, ...state });
  }

  updatePageById = async () => {
    if (this.state.content.toString("html") === "") {
      return toast.error("please add content", {
        style: { zIndex: 123123123 },
      });
    }

    this.setState({ submitting: true });
    const convertedState = convertToRaw(this.state.content.getCurrentContent());
    const response = await api.put(`${base.pages}/${this.props.page.id}`, {
      title: this.state.title,
      description: this.state.description,
      content: draftToHtml(convertedState),
      isAvailable: this.state.isAvailable,
    });
    this.props.fetchPages();
    this.setState({ submitting: false });
    this.props.toggleVisible();
  };

  render() {
    return (
      <>
        <div
          dangerouslySetInnerHTML={{
            __html: this.state.content.toString("html"),
          }}
        ></div>
        <Modal
          title={this.props.page.title ? "Update Page" : "Create Page"}
          centered
          visible={this.props.visible}
          onCancel={this.props.onCancel}
          width={1000}
          zIndex={123123}
          footer={[]}
        >
          <Form
            name="basic"
            initialValues={{
              title: _.get(this.props.page, "title", ""),
              description: _.get(this.props.page, "description", ""),
              isAvailable: _.get(this.props.page, "isAvailable", false),
            }}
            onFinish={
              this.props.page.title
                ? this.updatePageById
                : this.handleValidSubmit
            }
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input Title!" }]}
            >
              <Input onChange={this.handleChange("title")} />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please input Descripton!" }]}
            >
              <Input onChange={this.handleChange("description")} />
            </Form.Item>

            <Editor
              editorState={this.state.content}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={this.onEditorStateChange}
            />

            <Form.Item name="isAvailable" valuePropName="checked">
              <Checkbox onChange={this.handleOnCheckBoxChange("isAvailable")}>
                isAvailable
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={this.state.submitting}
                loading={this.state.submitting}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default AddNewPage;
