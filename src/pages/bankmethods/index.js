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

class BankMethods extends Component {
  state = {
    bankMethods: [],
    loading: false,
    searchText: "",
    searchedColumn: "",
    visible: false,
    bankMethod: {},
  };

  columns = [
    {
      title: "user",
      dataIndex: ["user", "email"],
      key: "user",
    },
    {
      title: "bankName",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "ifscCode",
      dataIndex: "ifscCode",
      key: "ifscCode",
    },
    {
      title: "accountNumber",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
  ];

  componentDidMount() {
    const filters = queryString.parse(this.props.location.search);
    this.fetchMethods(filters);
  }

  fetchMethods = async (filters = {}) => {
    try {
      this.setState({ loading: true });
      const response = await api.get(
        `/admin/bank?${queryString.stringify(filters)}`
      );
      const bankMethods = _.get(response, "data.data.bankMethods").map(
        (coupon) => ({
          ...coupon,
          key: coupon.id,
        })
      );
      this.setState({ loading: false, bankMethods });
    } catch (error) {}
  };

  render() {
    return (
      <div>
        <br />

        <br />
        <Table
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.bankMethods}
          className="table-responsive"
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default BankMethods;
