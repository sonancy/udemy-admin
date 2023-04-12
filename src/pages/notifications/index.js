import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Table, Button, Modal } from "antd";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import queryString from "query-string";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [notification, setNotification] = useState({});
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const toggleModal = () => {
    setVisible(!visible);
  };
  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.notification) {
      getNotificationById(query.notification);
    }
    getNotifications();
  }, []);

  const columns = [
    {
      title: "Notification",
      key: "name",
      render: (value, row) => {
        console.log("value===", value);
        return (
          <Link to="" className="text-reset notification-item" key={value.id}>
            <div className="media">
              <div className="avatar-xs mr-3">
                <span className="avatar-title bg-success rounded-circle font-size-16">
                  <i className="mdi mdi-cart-outline"></i>
                </span>
              </div>
              <div className="media-body">
                <h6 className="mt-0 mb-1">{value.title}</h6>
                {value.reason && (
                  <div className="font-size-12 text-muted">
                    <p className="mb-1">{value.reason}</p>
                  </div>
                )}
              </div>
            </div>
            <div></div>
          </Link>
        );
      },
    },
    {
      title: "View",
      dataIndex: "id",
      render: (value) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              getNotificationById(value);
            }}
          >
            View
          </Button>
        );
      },
    },
  ];

  const getNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/notifications");
      console.log("Response===", response.data);
      const notifications = response.data.data.notifications;
      setNotifications(notifications);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const getNotificationById = async (id) => {
    try {
      setNotification({});
      setLoading(true);
      const response = await api.get(`/admin/notifications/${id}`);
      const notification = response.data.data.notification;
      setNotification(notification);
      toggleModal();
      getNotifications();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {visible && (
        <Modal visible={visible} onOk={toggleModal} onCancel={toggleModal}>
          <table>
            <tr>
              <td>Notification Id : </td>
              <td style={{ marginRight: "20px" }}></td>
              <td>{notification.id}</td>
            </tr>
            <tr>
              <td>Notification Message : </td>
              <td style={{ marginRight: "20px" }}></td>
              <td>{notification.title}</td>
            </tr>
            <tr>
              <td>Date : </td>
              <td style={{ marginRight: "20px" }}></td>
              <td>{notification.createdAt.split("T")[0]}</td>
            </tr>
            {notification.reason && (
              <tr>
                <td>Reason : </td>
                <td style={{ marginRight: "20px" }}></td>
                <td>{notification.reason}</td>
              </tr>
            )}
            {notification.course && (
              <tr>
                <td>Course : </td>
                <td style={{ marginRight: "20px" }}></td>
                <td>
                  <Button
                    type="primary"
                    href={`/courses/${notification.course}`}
                  >
                    View Course
                  </Button>
                </td>
              </tr>
            )}
          </table>
        </Modal>
      )}
      <Table columns={columns} dataSource={notifications} loading={loading} />
    </>
  );
};

export default Notification;
