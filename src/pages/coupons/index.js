import React, { Component } from "react";
import { Table, Input, Button as Btn, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import api from "../../api/axios";
import base from "../../api/points";
import * as _ from "lodash";
import { Button } from "reactstrap";
// import AddNewCategory from "./addNewCategory";
import { toast } from "react-toastify";
import queryString from "query-string";
import AddNewCoupon from "./addNewCoupon";

class Coupons extends Component {
  state = {
    coupons: [],
    loading: false,
    searchText: "",
    searchedColumn: "",
    visible: false,
    coupon: {},
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
      title: "couponCode",
      dataIndex: "couponCode",
      key: "couponCode",
      render: (value) => <p>{value.toString()}</p>,
    },
    {
      title: "isGlobale",
      dataIndex: "isGlobale",
      key: "isGlobale",
      render: (value) => <p>{value.toString()}</p>,
    },
    {
      title: "isInstructorCreated",
      dataIndex: "isInstructorCreated",
      key: "isInstructorCreated",
      render: (value) => <p>{value.toString()}</p>,
    },
    {
      title: "limit",
      dataIndex: "limit",
      key: "limit",
      render: (value) => <p>{value.toString()}</p>,
    },
    {
      title: "isUnlimited",
      dataIndex: "isUnlimited",
      key: "isUnlimited",
      render: (value) => <p>{value.toString()}</p>,
    },
    {
      title: "expireAt",
      dataIndex: "expireAt",
      key: "expireAt",
      render: (value) => {
        return <p>{value.toString().split("T")[0]}</p>;
      },
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
            this.fetchCouponsById(value);
          }}
        >
          Edit
        </Button>
      ),
    },
    {
      title: "Delete",
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          color="danger"
          className="btn btn-danger waves-effect waves-light"
          onClick={() => {
            this.deleteCouponById(value);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  componentDidMount() {
    const filters = queryString.parse(this.props.location.search);
    this.fetchCoupons(filters);
  }

  fetchCoupons = async (filters = {}) => {
    try {
      this.setState({ loading: true });
      const response = await api.get(
        `${base.coupons}?${queryString.stringify(filters)}`
      );
      const coupons = _.get(response, "data.data.coupons").map((coupon) => ({
        ...coupon,
        key: coupon.id,
      }));
      this.setState({ loading: false, coupons });
    } catch (error) {}
  };

  fetchCouponsById = async (id) => {
    this.setState({ loading: true });
    const response = await api.get(`/admin/coupons/${id}`);
    const coupon = _.get(response, "data.data.coupon", {});
    if (coupon) {
      this.setState({ ...this.state, coupon });
      this.toggleVisible();
    }
    this.setState({ loading: false });
  };

  deleteCouponById = async (id) => {
    this.setState({ loading: true });
    const response = await api.delete(`/admin/coupons/${id}`);
    const coupon = _.get(response, "data.data.coupon", {});
    this.fetchCoupons();
    toast.success("coupon deleted Successfully!");
    this.setState({ loading: false });
  };

  toggleVisible = () => {
    this.setState({ ...this.state, visible: !this.state.visible });
    if (this.state.visible === false) {
      this.setState({ coupon: {} });
    }
  };
  render() {
    return (
      <div>
        <br />
        {this.state.visible && (
          <AddNewCoupon
            coupon={this.state.coupon}
            visible={this.state.visible}
            toggleModal={this.toggleVisible}
            fetchCoupons={this.fetchCoupons}
          />
        )}
        <div className="d-flex justify-content-end align-items-center">
          <Button
            color="primary"
            className="btn btn-primary waves-effect waves-light"
            onClick={() => {
              this.setState({ coupon: {} });
              this.toggleVisible();
            }}
          >
            Add New Coupon
          </Button>
        </div>
        <br />
        <Table
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.coupons}
          className="table-responsive"
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Coupons;
