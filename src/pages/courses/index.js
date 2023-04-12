import React, { Component } from "react";
import { Table, Input, Button as Btn, Tag, Space, Modal, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import api from "../../api/axios";
import base from "../../api/points";
import * as _ from "lodash";
import { Button } from "reactstrap";
import history from "../../utils/history";
const queryString = require("query-string");

class Courses extends Component {
  state = {
    courses: [],
    loading: false,
    searchText: "",
    searchedColumn: "",
    showRejectModal: false,
    rejectSectionId: null,
    rejectReason: null,
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

      ...this.getColumnSearchProps("title"),
      sorter: (a, b) => {
        return a.title.localeCompare(b.title);
      },
      render: (title, record) => <span>{record.title}</span>,
    },
    {
      title: "dshort",
      dataIndex: "dshort",
      key: "dshort",
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      ...this.getColumnSearchProps("status"),
      sorter: (a, b) => {
        return a.status.localeCompare(b.status);
      },
      render: (status, record) => <span>{record.status}</span>,
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
      ...this.getColumnSearchProps("price"),
    },
    {
      title: "isFree",
      dataIndex: "isFree",
      key: "isFree",
      render: (value) => <p>{value.toString()}</p>,
      sorter: (a, b) => {
        return a.isFree.localeCompare(b.isFree);
      },
      render: (isFree, record) => <span>{record.isFree.toString()}</span>,
    },
    {
      title: "totalHours",
      dataIndex: "totalHours",
      key: "totalHours",
      sorter: { compare: (a, b) => a.totalHours - b.totalHours },
      render: (totalHours, record) => (
        <span>
          {Math.floor(record.totalHours / 3600) <= 0
            ? `1 Hr`
            : `${Math.floor(record.totalHours / 3600)} Hr`}
        </span>
      ),
    },
    {
      title: "isDeleted",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (value) => <p>{value.toString()}</p>,
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
            history.push("/courses/" + value);
          }}
        >
          View
        </Button>
      ),
    },
    // {
    //   title: "Approve",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (value, column) => (
    //     <Button
    //       color="success"
    //       className="btn btn-success waves-effect waves-light"
    //       onClick={() => this.updateCourseById(value, { status: "approved" })}
    //       disabled={column.status === "approved"}
    //     >
    //       Approve
    //     </Button>
    //   ),
    // },
    {
      title: "Publish",
      dataIndex: "id",
      key: "id",
      render: (value, column) => (
        <Button
          color="info"
          className="btn btn-success waves-effect waves-light"
          onClick={() => this.updateCourseById(value, { status: "published" })}
          disabled={column.status === "published"}
        >
          Publish
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
    this.fetchCourses(filters);
  }

  showModal = (id) => {
    console.log(id);
    this.setState({ rejectSectionId: id });
    this.toggleRejectModal();
  };

  toggleRejectModal = () => {
    this.setState({
      showRejectModal: !this.state.showRejectModal,
    });
  };

  fetchCourses = async (filters = {}) => {
    try {
      this.setState({ loading: true });
      const response = await api.get(
        `${base.courses}?${queryString.stringify(filters)}`
      );
      const courses = _.get(response, "data.data.courses").map((course) => ({
        ...course,
        key: course.id,
      }));
      this.setState({ loading: false, courses });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  updateCourseById = async (id, body) => {
    try {
      this.setState({ loading: true });
      const response = await api.put(`${base.courses}/${id}`, {
        ...body,
      });
      this.fetchCourses();
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  };
  handleChange = (key) => (e) => {
    this.setState({ ...this.state, [key]: e.target.value });
  };

  render() {
    console.log("this.====", this.state);
    return (
      <div>
        <br />
        <div className="d-flex justify-content-end align-items-center"></div>
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
                this.updateCourseById(this.state.rejectSectionId, {
                  rejectReason: this.state.rejectReason,
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
        <br />
        <Table
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.courses}
          className="table-responsive"
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Courses;
