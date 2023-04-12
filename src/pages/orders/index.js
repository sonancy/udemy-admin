import React, { Component } from "react";
import { Table, Input, Button as Btn, Tag, Space, Modal, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import api from "../../api/axios";
import base from "../../api/points";
import * as _ from "lodash";
import { Button } from "reactstrap";
const queryString = require("query-string");

class Orders extends Component {
  state = {
    orders: [],
    loading: false,
    searchText: "",
    searchedColumn: "",
    showRejectModal: false,
    rejectEnrollmentId: null,
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
      title: "FirstName",
      dataIndex: ["user", "firstName"],
      key: "user",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        return a.user.firstName.localeCompare(b.user.firstName);
      },
      render: (user, record) => <span>{record.user.firstName}</span>,
    },
    {
      title: "LastName",
      dataIndex: ["user", "lastName"],
      key: "user",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        return a.user.lastName.localeCompare(b.user.lastName);
      },
      render: (user, record) => <span>{record.user.lastName}</span>,
    },
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
      title: "Price",
      dataIndex: ["course", "price"],
      key: "course",
      defaultSortOrder: "descend",
      render: (course, record) => <span>{record.course.price}</span>,
    },
    {
      title: "Paid",
      dataIndex: "totalPaid",
      key: "totalPaid",
      defaultSortOrder: "descend",

      render: (totalPaid, record) => <span>{record.totalPaid}</span>,
    },
    {
      title: "OrderID",
      dataIndex: "id",
      key: "id",
      defaultSortOrder: "descend",
      ...this.getColumnSearchProps("id"),

      render: (id, record) => <span>{record.id}</span>,
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",

      render: (value) => <span>{value.toString().split("T")[0]}</span>,
    },
    {
      title: "paid",
      dataIndex: "id",
      key: "id",
      render: (value, column) => (
        <Button
          color="info"
          className="btn btn-success waves-effect waves-light"
          onClick={() => {
            this.updateById(value, { status: "paid" });
          }}
          disabled={column.status === "paid"}
        >
          Paid
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
          className="btn btn-success waves-effect waves-light"
          onClick={() => {
            this.showModal(value);
          }}
          disabled={column.status === "rejected"}
        >
          Reject
        </Button>
      ),
    },
  ];

  async componentDidMount() {
    const filters = queryString.parse(this.props.location.search);
    this.fetchOrders(filters);
  }
  showModal = (id) => {
    console.log(id);
    this.setState({ rejectEnrollmentId: id });
    this.toggleRejectModal();
  };

  toggleRejectModal = () => {
    this.setState({
      showRejectModal: !this.state.showRejectModal,
    });
  };

  handleChange = (key) => (e) => {
    this.setState({ ...this.state, [key]: e.target.value });
  };

  fetchOrders = async (filters = {}) => {
    try {
      this.setState({ loading: true });
      const response = await api.get(
        `/admin/orders?${queryString.stringify(filters)}`
      );
      const orders = _.get(response, "data.data.orders").map((order) => ({
        ...order,
        key: order.id,
      }));
      this.setState({ loading: false, orders });
    } catch (error) {}
  };

  updateById = async (id, body) => {
    try {
      this.setState({ loading: true });
      const response = await api.put(`/admin/orders/${id}`, body);

      this.setState({ loading: false });
      this.fetchOrders();
    } catch (error) {
      this.setState({ loading: false });
    }
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
                this.updateById(this.state.rejectEnrollmentId, {
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
        <br />
        <Table
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.orders}
          className="table-responsive"
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Orders;
