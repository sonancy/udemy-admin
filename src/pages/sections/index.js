import React, { Component } from "react";
import { Table, Tag, Space } from "antd";
import api from "../../api/axios";
import base from "../../api/points";
import * as _ from "lodash";
import { Button } from "reactstrap";
import queryString from "query-string";

class Sections extends Component {
  state = {
    sections: [],
    loading: false,
  };

  columns = [
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      defaultSortOrder: "descend",
      sorter: { compare: (a, b) => a.order - b.order },
      render: (order, record) => <span>{record.order}</span>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => {
        return a.title.localeCompare(b.title);
      },
      render: (title, record) => <span>{record.title}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => {
        return a.status.localeCompare(b.status);
      },
      render: (status, record) => <span>{record.status}</span>,
    },
    {
      title: "Instructor",
      dataIndex: "instructor",
      key: "instructor",
      sorter: (a, b) => {
        return a.instructor.localeCompare(b.instructor);
      },
      render: (instructor, record) => <span>{record.instructor}</span>,
    },
    {
      title: "Course",
      dataIndex: "courseId",
      key: "courseId",
      sorter: (a, b) => {
        return a.courseId.localeCompare(b.courseId);
      },
      render: (courseId, record) => <span>{record.courseId}</span>,
    },
  ];

  async componentDidMount() {
    const filters = queryString.parse(this.props.location.search);
    this.fetchSections(filters);
  }

  fetchSections = async (filters = {}) => {
    try {
      this.setState({ loading: true });
      const response = await api.get(
        `${base.sections}?${queryString.stringify(filters)}`
      );
      const sections = _.get(response, "data.data.sections").map((section) => ({
        ...section,
        key: section.id,
      }));
      this.setState({ loading: false, sections });
    } catch (error) {}
  };

  updateSectionStatusById = async (id, status) => {
    try {
      this.setState({ loading: true });
      const response = await api.put(`${base.sections}/${id}`, {
        status,
      });
      this.setState({ loading: false });
      this.fetchSections();
    } catch (error) {}
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
          dataSource={this.state.sections}
          className="table-responsive"
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Sections;
