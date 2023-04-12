import React, {useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import api from "../api/axios";
import base from "../api/points";
import { getCookie, removeCookie } from "../utils/cookies";
import * as _ from "lodash";
import { addUserSuccess } from "../redux/auth/actions";
import Layout from "./VerticalLayout";
import urls from "../api/urls"
const PrivateRoute = ({
  user,
  addUserSuccess: userAssign,
  component: Component,
  ...rest
}) => {
  const [isAvailbe, setIsAvailable] = useState(false);

  useEffect(() => {
    checkUserAvailable();
  }, []);

  const checkUserAvailable = async () => {
    const token = getCookie("token");
    if (token) {
      if (!_.get(user, "user")) {
        api
          .get(base.me)
          .then((response) => {
            if (
              response.status === 200 &&
              _.get(response, "data.is_admin", false)
            ) {
              setIsAvailable(true);
              userAssign(response.data);
            } else {
              setIsAvailable(false);
              window.location.href = `${urls.auth}/auth/sign-in`;
            }
          })
          .catch((error) => {
            setIsAvailable(false);
            removeCookie("token");
            window.location.href = `${urls.auth}/auth/sign-in`;
          });
      } else {
        setIsAvailable(true);
      }
    } else {
      window.location.href = `${urls.auth}/auth/sign-in`;
    }
  };

  return (
    <Route
      {...rest}
      component={(props) => {
        return isAvailbe ? (
          <>
            <Layout>
              <Component {...props} />
            </Layout>
          </>
        ) : null;
      }}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, { addUserSuccess })(PrivateRoute);
