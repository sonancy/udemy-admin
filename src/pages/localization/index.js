import React, { Component } from "react";
import api from "../../api/axios";
import base from "../../api/points";
import queryString from "query-string";
import { Table, Tag, Space } from "antd";
import { Input, Button as Btn, Modal, Form } from "antd";
import { Button } from "reactstrap";
import AddNewLocalization from "./addNewLocalization";

class Localization extends Component {
  state = {
    loading: true,
    localizations: [],
    visible: false,
    localization: null,
  };

  async componentDidMount() {
    this.fetchLocalization();
  }

  columns = [
    {
      title: "languageName",
      dataIndex: "languageName",
      key: "languageName",
    },
    {
      title: "country",
      dataIndex: "country",
      key: "country",
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
            this.fetchLocalizationById(value);
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
            this.deleteLocalizationById(value);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  fetchLocalization = async (filters = {}) => {
    try {
      this.setState({ loading: true });
      const response = await api.get(
        `${base.localizations}?${queryString.stringify(filters)}`
      );
      const data = response.data.data.localizations;
      this.setState({ localizations: data, loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  fetchLocalizationById = async (id) => {
    try {
      this.setState({ loading: true });
      const response = await api.get(`${base.localizations}/${id}`);
      const data = response.data.data.localization;
      this.setState({ localization: data, loading: false });
      this.toggleModal();
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  deleteLocalizationById = async (id) => {
    try {
      this.setState({ loading: true });
      const response = await api.delete(`${base.localizations}/${id}`);
      this.setState({ loading: false });
      this.fetchLocalization();
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  toggleModal = () => {
    this.setState({ visible: !this.state.visible });
  };

  render() {
    return (
      <div>
        {this.state.visible && (
          <AddNewLocalization
            visible={this.state.visible}
            localization={this.state.localization}
            toggleModal={this.toggleModal}
            fetchLocalizations={this.fetchLocalization}
          />
        )}
        <div className="d-flex justify-content-end align-items-center">
          <Button
            color="primary"
            className="btn btn-primary waves-effect waves-light"
            onClick={() => {
              this.setState({ localization: {} });
              this.toggleModal();
            }}
          >
            Add New Localization
          </Button>
        </div>
        <Table
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.localizations}
          className="table-responsive"
        />
      </div>
    );
  }
}

export default Localization;
