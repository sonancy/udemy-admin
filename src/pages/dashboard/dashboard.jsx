import React, { Component } from "react";
import { Row, Col, Button, Input, Card, CardBody } from "reactstrap";
import { toast } from "react-toastify";
import { Button as Btn } from "antd";
// import images
import servicesIcon1 from "../../assets/images/services-icon/01.png";
import api from "../../api/axios";
import base from "../../api/points";
import Loader from "react-loader-spinner";
import ReactEcharts from "echarts-for-react";
import socket from "../../utils/socket";

class DashBoard extends Component {
  state = {
    counts: {},
    loading: false,
    orderChart: [],
    userChart: [],
    siteWallet: null,
  };

  async componentDidMount() {
    this._isMounted = true;
    this.fetchDashboard();
    this.fetchDashboardCharts();

    if (this._isMounted) {
      socket.on("ordered", (data) => {
        let orders = this.state.orderChart;
        if (orders.length > 0) {
          orders[orders.length > 0 ? orders.length - 1 : 0].count =
            orders[orders.length > 0 ? orders.length - 1 : 0].count + 1;
        }
        this.setState({ orderChart: orders });
      });

      socket.on("incrementWallet", (amount) => {
        if (this.state.siteWallet) {
          const siteWallet = this.state.siteWallet;
          siteWallet.currentEarnings += amount;
          siteWallet.totalEarnings += amount;
          this.setState({
            siteWallet,
          });
        }
      });
      socket.on("user_created", (data) => {
        let users = this.state.userChart;
        if (users.length > 0) {
          users[users.length > 0 ? users.length - 1 : 0].count =
            users[users.length > 0 ? users.length - 1 : 0].count + 1;
        }
        this.setState({ userChart: users });
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchDashboard = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get(base.dashboard);
      const datas = response.data.data;
      this.setState({ counts: datas, loading: false });
    } catch (error) {
      toast.error("something went wrong during fetch data");
      this.setState({ loading: false });
    }
  };

  fetchDashboardCharts = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get(`${base.dashboard}/chart`);
      const datas = response.data.data.orders;
      const users = response.data.data.users;
      const siteWallet = response.data.data.siteWallet;
      delete siteWallet._id;
      delete siteWallet.id;
      delete siteWallet.__v;
      delete siteWallet.createdAt;
      delete siteWallet.updatedAt;
      this.setState({
        orderChart: datas,
        userChart: users,
        siteWallet,
        loading: false,
      });
    } catch (error) {
      toast.error("something went wrong during fetch data");
      this.setState({ loading: false });
    }
  };
  getOrderOption = () => {
    const data = this.state.orderChart.map((order) => order._id.timestamp);
    const displayData = this.state.orderChart.map((order) => order.count);
    return {
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data,
        axisLable: {
          color: "#ffffff",
        },
        axisLine: {
          lineStyle: {
            color: "#74788d",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLable: {
          color: "#ffffff",
        },
        axisLine: {
          lineStyle: {
            color: "#74788d",
          },
        },
      },
      series: [
        {
          data: displayData,
          type: "line",
        },
      ],
      color: ["#556ee6"],
      textStyle: {
        color: ["#74788d"],
      },
    };
  };

  getUserOption = () => {
    const data = this.state.userChart.map((user) => user._id.timestamp);
    const displayData = this.state.userChart.map((user) => user.count);
    return {
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data,
        axisLable: {
          color: "#ffffff",
        },
        axisLine: {
          lineStyle: {
            color: "#74788d",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLable: {
          color: "#ffffff",
        },
        axisLine: {
          lineStyle: {
            color: "#74788d",
          },
        },
      },
      series: [
        {
          data: displayData,
          type: "line",
        },
      ],
      color: ["#556ee6"],
      textStyle: {
        color: ["#74788d"],
      },
    };
  };

  render() {
    return (
      <div>
        <div className="container-fluid">
          <Row className="d-flex justify-content-between align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Dashboard</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item active">Learnify Admin</li>
                </ol>
              </div>
            </Col>
            <Col
              sm={6}
              className="d-flex justify-content-end align-items-center"
            >
              <div className="page-title-box">
                <Btn
                  type="primary"
                  loading={this.state.loading}
                  onClick={() => {
                    this.fetchDashboard();
                    this.fetchDashboardCharts();
                  }}
                >
                  Reload Data
                </Btn>
              </div>
            </Col>
          </Row>

          <h1>Site Data</h1>
          {this.state.loading && (
            <div className="text-center  m-8">
              <Loader type="Grid" color="#626ed4" height={50} width={50} />
            </div>
          )}
          <Row>
            {this.state.counts &&
              !this.state.loading &&
              Object.keys(this.state.counts).map((count) => {
                return (
                  <Col xl={4} md={6} key={count}>
                    <Card className="mini-stat bg-primary text-white">
                      <CardBody>
                        <div className="mb-4">
                          <div className="float-left mini-stat-img mr-4">
                            <img src={servicesIcon1} alt="" />
                          </div>
                          <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                            {count.toUpperCase()}
                          </h5>
                          <h4 className="font-weight-medium font-size-24 text-white">
                            {this.state.counts[count]}
                          </h4>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                );
              })}
          </Row>
          <h1>Site Earnings</h1>
          {this.state.loading && (
            <div className="text-center m-8">
              <Loader type="Grid" color="#626ed4" height={50} width={50} />
            </div>
          )}
          <Row>
            {this.state.siteWallet &&
              Object.keys(this.state.siteWallet).map((count) => {
                return (
                  <Col xl={4} md={6} key={count}>
                    <Card className="mini-stat bg-primary text-white">
                      <CardBody>
                        <div className="mb-4">
                          <div className="float-left mini-stat-img mr-4">
                            <img src={servicesIcon1} alt="" />
                          </div>
                          <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                            {count.toUpperCase()}
                          </h5>
                          <h4 className="font-weight-medium font-size-24 text-white">
                            {this.state.siteWallet[count].toFixed(2)}
                          </h4>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                );
              })}
          </Row>
          <Row>
            {this.state.orderChart && (
              <Col>
                <h1>Orders</h1>
                <ReactEcharts
                  style={{ height: "350px" }}
                  option={this.getOrderOption()}
                />
              </Col>
            )}
            {this.state.userChart && (
              <Col>
                <h1>Users</h1>
                <ReactEcharts
                  style={{ height: "350px" }}
                  option={this.getUserOption()}
                />
              </Col>
            )}
          </Row>
        </div>
      </div>
    );
  }
}

export default DashBoard;
