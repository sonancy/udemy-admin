import React, { Component } from "react";

import { Table, Tag, Space } from "antd";
import api from "../../api/axios";
import base from "../../api/points";
import * as _ from "lodash";
import { Button } from "reactstrap";
import AddNewPage from "./addNewPage";
import queryString from "query-string";

class SitePages extends Component {
  state = {
    pages: [],
    loading: false,
    visible: false,
    page: {},
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
      title: "isAvailable",
      dataIndex: "isAvailable",
      key: "isAvailable",
      render: (value) => <p>{value.toString()}</p>,
    },
    {
      title: "Delete",
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          color="danger"
          className="btn btn-danger waves-effect waves-light"
        >
          Delete
        </Button>
      ),
    },
    {
      title: "Edit",
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          color="info"
          className="btn btn-info waves-effect waves-light"
          onClick={() => {
            this.fetchPageById(value);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  componentDidMount() {
    const filters = queryString.parse(this.props.location.search);
    this.fetchPages(filters);
  }

  fetchPages = async (filters = {}) => {
    try {
      this.setState({ loading: true });
      const response = await api.get(
        `${base.pages}?${queryString.stringify(filters)}`
      );
      const pages = _.get(response, "data.data.pages").map((page) => ({
        ...page,
        key: page.id,
      }));
      this.setState({ loading: false, pages });
    } catch (error) {}
  };

  fetchPageById = async (id) => {
    try {
      this.setState({ loading: true });
      const response = await api.get(`${base.pages}/${id}`);
      console.log(response);
      const page = await _.get(response, "data.data.page");
      console.log("page===", page);
      this.setState({ loading: false, page });
      this.toggleVisible();
    } catch (error) {}
  };

  toggleVisible = () => {
    this.setState({ visible: !this.state.visible });
  };

  render() {
    return (
      <div>
        <br />
        <div className="d-flex justify-content-end align-items-center">
          <Button
            color="primary"
            className="btn btn-primary waves-effect waves-light"
            onClick={() => {
              this.setState({ page: {} });
              this.toggleVisible();
            }}
          >
            Add New Page
          </Button>
        </div>
        {this.state.visible && (
          <AddNewPage
            visible={this.state.visible}
            toggleVisible={this.toggleVisible}
            fetchPages={this.fetchPages}
            onCancel={this.toggleVisible}
            page={this.state.page}
          />
        )}
        <br />
        <Table
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.pages}
          className="table-responsive"
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default SitePages;
