import React, { Component } from "react";
import { Table, Tag, Space } from "antd";
import api from "../../apis/api";
import base from "../../apis/points";
import * as _ from "lodash";
import { Button } from "reactstrap";
import ReactPlayer from 'react-player';

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

class SectionsT extends Component {
  state = {
    sections: [],
    lectures: [],
    loading: false,
  };

  columns = [
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      defaultSortOrder: 'descend',
      sorter: {compare: (a, b) => a.order - b.order,},
      render: (order, record) => <span>{record.order}</span>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => {return a.title.localeCompare(b.title)},
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
      sorter: (a, b) => {return a.status.localeCompare(b.status)},
      render: (status, record) => <span>{record.status}</span>,
    },
    {
      title: "Instructor",
      dataIndex: "instructor",
      key: "instructor",
      sorter: (a, b) => {return a.instructor.localeCompare(b.instructor)},
      render: (instructor, record) => <span>{record.instructor}</span>,
    },
    {
      title: "Course",
      dataIndex: "courseId",
      key: "courseId",
      sorter: (a, b) => {return a.courseId.localeCompare(b.courseId)},
      render: (courseId, record) => <span>{record.courseId}</span>,
    },
    
    {
      title: "Activate",
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          color="success"
          className="btn btn-success waves-effect waves-light"
        >
          Activate
        </Button>
      ),
    },
    {
      title: "Suspend",
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          color="danger"
          className="btn btn-danger waves-effect waves-light"
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
        <Button color="info" className="btn btn-info waves-effect waves-light">
          Edit
        </Button>
      ),
    },
  ];

  columns2 = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      defaultSortOrder: 'descend',
      sorter: (a, b) => {return a.title.localeCompare(b.title)},
      render: (title, record) => <span>{record.title}</span>,
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      defaultSortOrder: 'descend',
      sorter: {compare: (a, b) => a.order - b.order,},
      render: (order, record) => <span>{record.order}</span>,
    },
    {
      title: "LecutreType",
      dataIndex: "lecutreType",
      key: "lecutreType",
      defaultSortOrder: 'descend',
      sorter: (a, b) => {return a.lecutreType.localeCompare(b.lecutreType)},
      render: (lecutreType, record) => <span>{record.lecutreType}</span>,
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: (source, record) => <span>{record.source.url}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      defaultSortOrder: 'descend',
      sorter: (a, b) => {return a.status.localeCompare(b.status)},
      render: (status, record) => <span>{record.status}</span>,
    },
  ];

  // columns3 = [
  //   {
  //     title: "Source",
  //     dataIndex: "url",
  //     key:"url",
  //   }
  // ];

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const response = await api.get(base.sections);
      const sections = _.get(response, "data.data.sections").map((section) => ({
        ...section,
        key: section.id,
      }));
      const response2 = await api.get(base.lectures);
      const lectures = _.get(response2, "data.data.lectures.docs").map((lecture) => ({
        ...lecture,
        key: lecture.id,
      }));
      this.setState({ loading: false, sections , lectures });
    } catch (error) {}
  }

  render() {
    return (
      <div>
        <br />
        <div className="d-flex justify-content-center align-items-center">
        {/* <ReactPlayer url='https://www.youtube.com/watch?v=FJs6K0reL3I&ab_channel=ScoopWhoop' controls='true'/> */}
        </div>
        <br />
        <Table
          loading={this.state.loading}
          columns={this.columns}
          expandable={{
              expandedRowRender: record => 
              <p style={{ margin: 0 }}>
              <Table
              loading={this.state.loading}
              columns={this.columns2}
              dataSource={this.state.lectures}
              className="table-responsive"
              onChange={this.handleTableChange}
          /></p>,
          }}
          //rowSelection={{ ...rowSelection }}
          dataSource={this.state.sections}
          className="table-responsive"
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default SectionsT;
