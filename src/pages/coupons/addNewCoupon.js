import React, { Component } from "react";
import { Modal, Button, Space, Form, Input, Checkbox, Select } from "antd";
import api from "../../api/axios";
import { toast } from "react-toastify";
import * as _ from "lodash";
import removeEmpty from "../../utils/removeObj";
import base from "../../api/points";

const { Option } = Select;
class EditCoupon extends Component {
  state = {
    couponCode: "",
    isGlobale: false,
    isInstructorCreated: false,
    courseId: "",
    limit: 5,
    isUnlimited: false,
    submitting: false,
    value: 0,
    courses: [],
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
      couponCode: _.get(this.props.coupon, "couponCode", ""),
      isGlobale: _.get(this.props.coupon, "isGlobale", true),
      isInstructorCreated: _.get(
        this.props.coupon,
        "isInstructorCreated",
        false
      ),
      courseId: _.get(this.props.coupon, "courseId", ""),
      limit: _.get(this.props.coupon, "limit", 10),
      isUnlimited: _.get(this.props.coupon, "isUnlimited", true),
      value: _.get(this.props.coupon, "value", 0),
    });
    this.fetchCourses();
  }

  fetchCourses = async (filters = {}) => {
    try {
      this.setState({ loading: true });
      const response = await api.get(`${base.courses}`);
      const courses = _.get(response, "data.data.courses").map((course) => ({
        ...course,
        key: course.id,
      }));
      this.setState({ loading: false, courses });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  updateCouponById = async () => {
    try {
      this.setState({ ...this.state, submitting: true });
      let body;
      body = removeEmpty(
        _.omit(this.state, ["submitting", "courses", "loading"])
      );
      const coupon = await api.put(`/admin/coupons/${this.props.coupon.id}`, {
        ...body,
      });
      if (coupon) {
        toast.success("coupon updated successfully!");
        this.props.toggleModal();
        this.props.fetchCoupons();
        this.setState({ ...this.state, submitting: false });
      } else {
        this.setState({ submitting: false });
      }
    } catch (error) {
      this.setState({ submitting: false });
    }
  };

  createCoupon = async () => {
    try {
      this.setState({ ...this.state, submitting: true });

      const body = removeEmpty(
        _.omit(this.state, ["submitting", "courses", "loading"])
      );
      const coupon = await api.post(`/admin/coupons`, {
        ...body,
      });
      if (coupon) {
        toast.success("coupon created successfully!");
        this.props.toggleModal();
        this.props.fetchCoupons();
        this.setState({ ...this.state, submitting: false });
      } else {
        this.setState({ submitting: false });
      }
    } catch (error) {
      this.setState({ submitting: false });
    }
  };

  render() {
    return (
      <Modal
        title={this.props.coupon.couponCode ? "Edit coupon" : "Create coupon"}
        centered
        visible={this.props.visible}
        footer={[]}
        width={1000}
        onCancel={this.props.toggleModal}
      >
        <Form
          initialValues={{
            couponCode: _.get(this.props.coupon, "couponCode", ""),
            isGlobale: _.get(this.props.coupon, "isGlobale", true),
            isInstructorCreated: _.get(
              this.props.coupon,
              "isInstructorCreated",
              false
            ),
            courseId: _.get(this.props.coupon, "courseId", ""),
            limit: _.get(this.props.coupon, "limit", 10),
            isUnlimited: _.get(this.props.coupon, "isUnlimited", false),
            value: _.get(this.props.coupon, "value", 0),
          }}
          onFinish={() => {
            if (this.props.coupon.couponCode) {
              this.updateCouponById();
            } else {
              this.createCoupon();
            }
          }}
        >
          <Form.Item
            label="couponCode"
            name="couponCode"
            rules={[{ required: true, message: "Please input couponCode!" }]}
          >
            <Input
              onChange={this.handleChange("couponCode")}
              disabled={_.get(this.props.coupon, "couponCode", "")}
            />
          </Form.Item>
          <Form.Item label="isGlobale" name="isGlobale" valuePropName="checked">
            <Checkbox onChange={this.handleOnCheckBoxChange("isGlobale")} />
          </Form.Item>
          <Form.Item
            label="isInstructorCreated"
            name="isInstructorCreated"
            valuePropName="checked"
          >
            <Checkbox
              onChange={this.handleOnCheckBoxChange("isInstructorCreated")}
            />
          </Form.Item>
          <Form.Item
            label="course"
            name="courseId"
            rules={[
              {
                required: true,
                message: "Please input course!",
              },
            ]}
          >
            <Select onChange={this.handleDropDownChange("courseId")}>
              {this.state.courses &&
                this.state.courses.map((course) => {
                  return (
                    <Select.Option value={course.id}>
                      {course.title}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item
            label="value"
            name="value"
            rules={[{ required: true, message: "coupon value is required!" }]}
          >
            <Input onChange={this.handleChange("value")} />
          </Form.Item>
          <Form.Item label="limit" name="limit">
            <Input type="number" onChange={this.handleChange("limit")} />
          </Form.Item>
          <Form.Item
            label="isUnlimited"
            name="isUnlimited"
            valuePropName="checked"
          >
            <Checkbox onChange={this.handleOnCheckBoxChange("isUnlimited")} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={this.state.submitting}
              loading={this.state.submitting}
            >
              {this.props.coupon.couponCode ? "Update" : "create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditCoupon;
