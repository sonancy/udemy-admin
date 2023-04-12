import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
import api from "../api/axios";
import { toast } from "react-toastify";

class NotificationDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      notifications: [],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.getNotifications();
  }

  getNotifications = async () => {
    try {
      const response = await api.get("/admin/notifications");
      const notifications = await response.data.data.notifications;
      this.setState({ ...this.state, notifications });
    } catch (err) {
      toast.error("faild to fetch notification");
    }
  };

  toggle() {
    this.setState((prevState) => ({
      menu: !prevState.menu,
    }));
  }
  render() {
    return (
      <React.Fragment>
        <Dropdown
          isOpen={this.state.menu}
          toggle={this.toggle}
          className="dropdown d-inline-block"
          tag="li"
        >
          <DropdownToggle
            className="btn header-item noti-icon waves-effect"
            id="page-header-notifications-dropdown"
            tag="button"
          >
            <i className="mdi mdi-bell-outline"></i>
            <span className="badge badge-danger badge-pill">
              {this.state.notifications.length}
            </span>
          </DropdownToggle>

          <DropdownMenu className="dropdown-menu-lg p-0" right>
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h5 className="m-0 font-size-16">
                    Notifications ({this.state.notifications.length})
                  </h5>
                </Col>
              </Row>
            </div>

            <SimpleBar style={{ height: "230px" }}>
              {this.state.notifications.map((notification) => {
                return (
                  <a
                    href={`/notifications?notification=${notification.id}`}
                    className="text-reset notification-item"
                    key={notification.id}
                  >
                    <div className="media">
                      <div className="avatar-xs mr-3">
                        <span className="avatar-title bg-success rounded-circle font-size-16">
                          <i className="mdi mdi-cart-outline"></i>
                        </span>
                      </div>
                      <div className="media-body">
                        <h6 className="mt-0 mb-1">{notification.title}</h6>
                        {notification.reason && (
                          <div className="font-size-12 text-muted">
                            <p className="mb-1">{notification.reason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </SimpleBar>
            <div className="p-2 border-top">
              <Link
                className="btn btn-sm btn-link font-size-14 btn-block text-center"
                to="#"
              >
                {" "}
                View all{" "}
              </Link>
            </div>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
  }
}
export default NotificationDropdown;
