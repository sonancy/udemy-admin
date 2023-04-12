import React, { Component } from "react";
import { Table, Input, Button as Btn, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import api from "../../api/axios";
import base from "../../api/points";
import * as _ from "lodash";
import { Button } from "reactstrap";
import AddNewCategory from "./addNewCategory";
import { toast } from "react-toastify";
const queryString = require("query-string");

class Categories extends Component {
  state = {
    categories: [],
    loading: false,
    searchText: "",
    searchedColumn: "",
    visible: false,
    category: {},
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Btn
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Btn>
          <Btn
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Btn>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      defaultSortOrder: "descend",
      ...this.getColumnSearchProps("title"),
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
    // {
    //   title: "isDeleted",
    //   dataIndex: "isDeleted",
    //   key: "isDeleted",
    //   render: (value) => <p>{value.toString()}</p>,
    // },
    {
      title: "Edit",
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          color="info"
          className="btn btn-info waves-effect waves-light"
          onClick={() => {
            this.fetchCategoryById(value);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  componentDidMount() {
    const filters = queryString.parse(this.props.location.search);
    this.fetchCategory(filters);
  }

  fetchCategory = async (filters = {}) => {
    try {
      this.setState({ loading: true });
      const response = await api.get(
        `${base.categories}?${queryString.stringify(filters)}`
      );
      const categories = _.get(response, "data.data.categories").map(
        (category) => ({
          ...category,
          key: category.id,
        })
      );
      this.setState({ loading: false, categories });
    } catch (error) {}
  };

  fetchCategoryById = async (id) => {
    this.setState({ loading: true });
    const response = await api.get(`/admin/categories/${id}`);
    const category = _.get(response, "data.data.category", {});
    if (category) {
      this.setState({ ...this.state, category });
      this.toggleVisible();
    }
    this.setState({ loading: false });
  };

  deleteCategoryById = async (id) => {
    this.setState({ loading: true });
    const response = await api.delete(`/admin/categories/${id}`);
    const category = _.get(response, "data.data.category", {});
    this.fetchCategory();
    toast.success("category deleted Successfully!");
    this.setState({ loading: false });
  };

  toggleVisible = () => {
    this.setState({ ...this.state, visible: !this.state.visible });
    if (this.state.visible === false) {
      this.setState({ category: {} });
    }
  };
  render() {
    return (
      <div>
        <br />
        {this.state.visible && (
          <AddNewCategory
            category={this.state.category}
            visible={this.state.visible}
            toggleModal={this.toggleVisible}
            fetchCategory={this.fetchCategory}
          />
        )}
        <div className="d-flex justify-content-end align-items-center">
          <Button
            color="primary"
            className="btn btn-primary waves-effect waves-light"
            onClick={() => {
              this.setState({ ...this.state, category: null });
              this.toggleVisible();
            }}
          >
            Add New Categories
          </Button>
        </div>
        <br />
        <Table
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.categories}
          className="table-responsive"
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Categories;
