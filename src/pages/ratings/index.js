import React, { Component } from "react";
import { Table, Input, Button as Btn, Tag, Space, Modal, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import api from "../../api/axios";
import base from "../../api/points";
import * as _ from "lodash";
import { Button } from "reactstrap";

class Ratings extends Component {
  state = {
    ratings: [],
    loading: false,
    
  };

  columns = [
    {
      title: "Course",
      dataIndex: ["course", "title"],
      key: "course",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        return a.course.title.localeCompare(b.course.title);
      },
      render: (course, record) => <span>{record.course.title}</span>,
    },
    
    {
      title: "UserName",
      dataIndex: ["user", "firstName"],
      key: "user",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        return a.user.firstName.localeCompare(b.user.firstName);
      },
      render: (user, record) => <span>{record.user.firstName}</span>,
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        return a.user.email.localeCompare(b.user.email);
      },
      render: (email, record) => <span>{record.user.email}</span>,
    },
    
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      defaultSortOrder: "descend",
      sorter: { compare: (a, b) => a.rating - b.rating },
      render: (rating, record) => <span>{record.rating}</span>,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        return a.comment.localeCompare(b.comment);
      },
      render: (comment, record) => <span>{record.comment}</span>,
    },
  ];

  async componentDidMount() {
    this.fetchRatings();
  }
  
  fetchRatings = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get(`/admin/ratings`);
      const ratings = _.get(response, "data.data.ratings").map((rating) => ({
        ...rating,
        key: rating.id,
      }));
      this.setState({ loading: false, ratings });
    } catch (error) {}
  };

  render() {
    return (
      <div>
        <br />
        <Table
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.ratings}
          className="table-responsive"
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Ratings;
