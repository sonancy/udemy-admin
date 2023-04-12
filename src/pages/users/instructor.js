import React, { Component } from "react";
import { Table, Input, Button as Btn, Tag, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import api from "../../api/axios";
import base from "../../api/points";
import * as _ from "lodash";
import { Button } from "reactstrap";
import { toast } from "react-toastify";
import EditUser from "./editUser";

class Instructor extends Component {
  state = {
    users: [],
    searchText: "",
    searchedColumn: "",
    loading: false,
    editVisible: "",
    user: {},
  };

  activateUserById = async (id) => {
    const user = await api.put(`/admin/users/${id}`, {
      status: "active",
    });
    toast.success("user activated successfully");
    this.fetchUser();
  };

  suspendUserById = async (id) => {
    const user = await api.put(`/admin/users/${id}`, {
      status: "suspended",
    });
    toast.success("user suspended successfully");
    this.fetchUser();
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
      title: "firstName",
      dataIndex: "firstName",
      key: "id",
      defaultSortOrder: "descend",
      ...this.getColumnSearchProps("firstName"),
      sorter: (a, b) => {
        return a.firstName.localeCompare(b.firstName);
      },
      render: (firstName, record) => <span>{record.firstName}</span>,
    },
    {
      title: "lastName",
      dataIndex: "lastName",
      key: "id",
      defaultSortOrder: "descend",
      ...this.getColumnSearchProps("lastName"),
      sorter: (a, b) => {
        return a.lastName.localeCompare(b.lastName);
      },
      render: (lastName, record) => <span>{record.lastName}</span>,
    },
    {
      title: "email",
      dataIndex: "email",
      key: "id",
      defaultSortOrder: "descend",
      ...this.getColumnSearchProps("email"),
      sorter: (a, b) => {
        return a.email.localeCompare(b.email);
      },
      render: (email, record) => <span>{record.email}</span>,
    },
    {
      title: "username",
      dataIndex: "username",
      key: "id",
      defaultSortOrder: "descend",
      ...this.getColumnSearchProps("username"),
      sorter: (a, b) => {
        return a.username.localeCompare(b.username);
      },
      render: (username, record) => <span>{record.username}</span>,
    },
    {
      title: "isAdmin",
      dataIndex: "isAdmin",
      key: "id",
      render: (value) => <p>{value.toString()}</p>,
    },
    {
      title: "isAuthor",
      dataIndex: "isAuthor",
      key: "id",
      render: (value) => <p>{value.toString()}</p>,
    },
    {
      title: "Activate",
      dataIndex: "id",
      key: "id",
      render: (value, column) => {
        return (
          <Button
            color="success"
            className="btn btn-success waves-effect waves-light"
            onClick={() => {
              this.activateUserById(value);
            }}
            disabled={column.status === "active" ? true : false}
          >
            Activate
          </Button>
        );
      },
    },
    {
      title: "Suspend",
      dataIndex: "id",
      key: "id",
      render: (value, column) => (
        <Button
          color="danger"
          className="btn btn-danger waves-effect waves-light"
          onClick={() => {
            this.suspendUserById(value);
          }}
          disabled={column.status === "suspended" ? true : false}
        >
          Suspend
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
            this.fetchUserById(value);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];
  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get(`/admin/users?isAuthor=true`);
      const users = _.get(response, "data.data.users").map((user) => ({
        ...user,
        key: user.id,
      }));
      this.setState({ loading: false, users });
    } catch (error) {}
  };

  fetchUserById = async (id) => {
    this.setState({ loading: true });
    const response = await api.get(`/admin/users/${id}`);
    const user = _.get(response, "data.data.user", {});
    if (user) {
      this.setState({ ...this.state, user: user });
      this.toggleVisible();
    }
    this.setState({ loading: false });
  };

  toggleVisible = () => {
    this.setState({ ...this.state, editVisible: !this.state.editVisible });
  };
  render() {
    return (
      <div>
        <br />
        {this.state.editVisible && (
          <EditUser
            user={this.state.user}
            toggleModal={this.toggleVisible}
            visible={this.state.editVisible}
            fetchUser={this.fetchUser}
          />
        )}
        <br />
        <Table
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.users}
          className="table-responsive"
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Instructor;
