import React, { Component, useEffect, useState } from "react";
import { Table, Tag, Space } from "antd";
import { Input, Button as Btn, Modal, Form, Pagination } from "antd";
import api from "../../api/axios";
import base from "../../api/points";
import * as _ from "lodash";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { toast } from "react-toastify";

const PaymentTransaction = (props) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [refId, setRefId] = useState("");
  const router = useHistory();
  const location = useLocation();

  const columns = [
    {
      title: "user",
      dataIndex: ["user", "firstName"],
      key: "user",
    },
    {
      title: "email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "id",
    },
    {
      title: "transactionType",
      dataIndex: "transactionType",
      key: "transactionType",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "id",
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => <span>{value.toString().split("T")[0]}</span>,
    },
    {
      title: "Pay",
      dataIndex: "id",
      key: "id",
      render: (value, record) => {
        return (
          <Btn
            type="primary"
            disabled={
              record.status === "paid" ||
              record.amount === 0 ||
              record.transactionType === "paid"
            }
            onClick={() => {
              setRefId(value);
              toggleVisible();
            }}
          >
            Pay
          </Btn>
        );
      },
    },
  ];

  const fetchPaymentTransaction = async () => {
    try {
      setLoading(true);
      const query = queryString.parse(location.search);
      const qryString = queryString.stringify(query);
      const response = await api.get(
        `${base.paymentTransactions}?${qryString}`
      );
      const transactions = _.get(response, "data.data.transactions.docs", [])
        .map((transaction) => ({
          ...transaction,
          key: transaction.id,
        }))
        .flat();
      const totalPagesS = _.get(
        response,
        "data.data.transactions.totalDocs",
        20
      );

      console.log("totalPagesS====", totalPagesS);
      const currentPageS = _.get(response, "data.data.transactions.page", 1);
      console.log(currentPageS);
      setLoading(false);
      setTransactions(transactions);
      setTotalPages(totalPagesS);
      setCurrentPage(currentPageS);
    } catch (error) {
      setLoading(false);
      console.log("error===", error);
    }
  };

  useEffect(() => {
    fetchPaymentTransaction();
  }, []);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  return (
    <div className="table-cst">
      <br />
      {visible && (
        <Modal
          title="confirm"
          footer={[]}
          visible={visible}
          onCancel={toggleVisible}
        >
          <Form
            name="basic"
            onFinish={async (values) => {
              values.status = "paid";
              const response = await api.put(
                `/admin/transactions/${refId}`,
                values
              );
              if (response.data.status === "success") {
                toast.success("user marked as paid!");
                toggleVisible();
                fetchPaymentTransaction();
              } else {
                toast.error("faild");
                toggleVisible();
              }
            }}
          >
            <Form.Item
              label="Reference Id"
              name="referenceId"
              rules={[
                { required: true, message: "Please input your referenceId!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Btn type="primary" htmlType="submit">
                Submit
              </Btn>
            </Form.Item>
          </Form>
        </Modal>
      )}
      <Table
        loading={loading}
        columns={columns}
        dataSource={transactions}
        className="table-responsive"
        pagination={false}
      />
      <Pagination
        total={totalPages}
        pageSize={10}
        showSizeChanger={false}
        current={currentPage}
        onChange={(page, pageSize) => {
          const query = queryString.parse(location.search);
          query.page = page;
          const queryStr = queryString.stringify(query);
          router.push(`/paymentTransaction?${queryStr}`);
        }}
      />
    </div>
  );
};

export default PaymentTransaction;
