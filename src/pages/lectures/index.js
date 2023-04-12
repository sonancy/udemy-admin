import React, { Component } from "react";
import { Table, Tag, Space } from "antd";
import { Input, Button as Btn, Modal, Form, Select } from "antd";
import api from "../../api/axios";
import base from "../../api/points";
import * as _ from "lodash";
import { Button } from "reactstrap";
import history from "../../utils/history";
const queryString = require("query-string");

const { Option } = Select;

class Lectures extends Component {
  state = {
    lectures: [],
    loading: false,
    showRejectModal: false,
    rejectLectureId: null,
    rejectReason: null,
    lecutreType: null,
    filters: {},
  };

  columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        return a.title.localeCompare(b.title);
      },
      render: (title, record) => <span>{record.title}</span>,
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      defaultSortOrder: "descend",
      sorter: { compare: (a, b) => a.order - b.order },
      render: (order, record) => <span>{record.order}</span>,
    },
    {
      title: "LecutreType",
      dataIndex: "lecutreType",
      key: "lecutreType",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        return a.lecutreType.localeCompare(b.lecutreType);
      },
      render: (lecutreType, record) => <span>{record.lecutreType}</span>,
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        return a.status.localeCompare(b.status);
      },
      render: (status, record) => <span>{record.status}</span>,
    },
    {
      title: "Approve",
      dataIndex: "id",
      key: "id",
      render: (value, column) => (
        <Button
          color="success"
          className="btn btn-success waves-effect waves-light"
          onClick={() => this.updateLectureById(value, { status: "approved" })}
          disabled={column.status === "approved"}
        >
          Approve
        </Button>
      ),
    },
    {
      title: "Reject",
      dataIndex: "id",
      key: "id",
      render: (value, column) => (
        <Button
          color="danger"
          className="btn btn-danger waves-effect waves-light"
          onClick={() => this.showModal(value)}
          disabled={column.status === "rejected"}
        >
          Reject
        </Button>
      ),
    },
  ];

  async componentDidMount() {
    const filters = queryString.parse(this.props.location.search);
    this.setState({ filters });
    this.fetchLectures(filters);
  }

  fetchLectures = async (filters = {}) => {
    try {
      this.setState({ loading: true });
      const response = await api.get(
        `${base.lectures}?${queryString.stringify(filters)}`
      );
      const lectures = _.get(response, "data.data.lectures").map((lecture) => ({
        ...lecture,
        key: lecture.id,
      }));
      this.setState({ loading: false, lectures });
    } catch (error) {}
  };
  showModal = (id) => {
    console.log(id);
    this.setState({ rejectLectureId: id });
    this.toggleRejectModal();
  };

  toggleRejectModal = () => {
    this.setState({
      showRejectModal: !this.state.showRejectModal,
    });
  };

  updateLectureById = async (id, body) => {
    try {
      this.setState({ loading: true });
      const response = await api.put(`${base.lectures}/${id}`, {
        ...body,
      });
      this.fetchLectures();
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  };
  handleChange = (key) => (e) => {
    this.setState({ ...this.state, [key]: e.target.value });
  };

  render() {
    return (
      <div>
        <br />
        {this.state.showRejectModal && (
          <Modal
            title="Reject Reason"
            visible={this.state.showRejectModal}
            onCancel={this.toggleRejectModal}
            footer={[]}
          >
            <Form
              name="basic"
              onFinish={() => {
                this.updateLectureById(this.state.rejectLectureId, {
                  rejectedReason: this.state.rejectReason,
                  status: "rejected",
                });
                this.toggleRejectModal();
              }}
            >
              <Form.Item
                label="Reject Reason"
                name="rejectReason"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input onChange={this.handleChange("rejectReason")} />
              </Form.Item>

              <Form.Item>
                <Btn type="primary" htmlType="submit">
                  Submit
                </Btn>
              </Form.Item>
            </Form>
          </Modal>
        )}
        <div className="d-flex justify-content-end align-items-center">
          <Select
            className="d-block"
            style={{ width: 200 }}
            onChange={(value) => {
              this.setState({ lecutreType: value });
              this.fetchLectures({ ...this.state.filters, lecutreType: value });
            }}
          >
            <Option value="video"> Video </Option>
            <Option value="document"> document </Option>
          </Select>
        </div>
        <br />
        <Table
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.lectures}
          className="table-responsive"
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Lectures;
