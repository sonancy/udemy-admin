import React, { Component } from "react";
import { Table, Tag, Space } from "antd";
import { Input, Button as Btn, Modal, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import api from "../../api/axios";
import base from "../../api/points";
import * as _ from "lodash";
import { Button } from "reactstrap";
import history from "../../utils/history";

class Enrollments extends Component {
  state = {
    enrollments: [],
    loading: false,
    showRejectModal: false,
    rejectLectureId: null,
    rejectReason: null,
  };

  columns = [
    {
      title: "course",
      dataIndex: ["courseId", "title"],
      key: "courseId",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        return a.courseId.title.localeCompare(b.courseId.title);
      },
      render: (title, record) => <span>{record.courseId.title}</span>,
    },
    {
      title: "user",
      dataIndex: ["userId", "email"],
      key: "userId",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        return a.userId.email.localeCompare(b.userId.email);
      },
      render: (title, record) => <span>{record.userId.email}</span>,
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => <span>{value.toString().split("T")[0]}</span>,
    },
  ];

  async componentDidMount() {
    this.fetchEnrollements();
  }

  fetchEnrollements = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get(base.enrollments);
      const enrollTransactions = _.get(
        response,
        "data.data.enrollTransactions"
      ).map((enrollTransaction) => ({
        ...enrollTransaction,
        key: enrollTransaction.id,
      }));
      this.setState({ loading: false, enrollments: enrollTransactions });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  handleChange = (key) => (e) => {
    this.setState({ ...this.state, [key]: e.target.value });
  };

  render() {
    return (
      <div className="table-cst">
        <br />
        <div className="d-flex justify-content-end align-items-center"></div>
        <br />
        <Table
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.enrollments}
          className="table-responsive"
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Enrollments;
