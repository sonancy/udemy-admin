import React, { Component } from "react";
import { Table, Tag, Space } from "antd";
import { Input, Button as Btn, Modal, Form } from "antd";
import api from "../../api/axios";
import base from "../../api/points";
import * as _ from "lodash";
import { Button } from "reactstrap";
import history from "../../utils/history";

class RejectedLectures extends Component {
  state = {
    lectures: [],
    loading: false,
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
      title: "View",
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          color="success"
          className="btn btn-success waves-effect waves-light"
          onClick={() => {
            history.push("/lecture/" + value);
          }}
        >
          View
        </Button>
      ),
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
  ];

  async componentDidMount() {
    this.fetchLectures();
  }

  fetchLectures = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get(base.lectures);
      const lectures = _.get(response, "data.data.lectures").map((lecture) => ({
        ...lecture,
        key: lecture.id,
      }));
      this.setState({ loading: false, lectures });
    } catch (error) {}
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
        <div className="d-flex justify-content-end align-items-center"></div>
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

export default RejectedLectures;
