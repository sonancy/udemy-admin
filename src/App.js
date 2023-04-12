import React, { Component, useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./utils/history";
import { AnimatedSwitch } from "react-router-transition";
import SecuredRoute from "./components/SecuredRoute";
import Dashboard from "./pages/dashboard/dashboard";
import Users from "./pages/users";
import AdminComponent from "./pages/users/admin";
import InstructorComponent from "./pages/users/instructor";
import Categories from "./pages/categories";
import Courses from "./pages/courses";
import Sections from "./pages/sections";

import Lectures from "./pages/lectures";
import RejectedLectures from "./pages/lectures/rejectedlectures";

import Ratings from "./pages/ratings";

import SitePages from "./pages/sitePages";
import Orders from "./pages/orders";
import CourseView from "./pages/courses/courseById";
import Enrollments from "./pages/transactions/enrollTransaction";
import Localization from "./pages/localization";
import socket from "./utils/socket";
import PaymentTransaction from "./pages/transactions/paymentTransaction";
import Settings from "./pages/settings";
import Coupon from "./pages/coupons";
import BankMethod from "./pages/bankmethods";
import Loader from "react-loader-spinner";
import urls from "./api/urls";
import Notifications from "./pages/notifications/index";

const RedirectToHome = ({ path }) => {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = path;
    }, 2000);
  }, []);

  return (
    <div
      className="text-center"
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
        flexDirection: "column",
      }}
    >
      <Loader type="Grid" color="#ffffff" height={80} width={80} />
      <h1 style={{ color: "#fff" }}>Redirecting...</h1>
    </div>
  );
};

class App extends Component {
  state = {};

  render() {
    return (
      <>
        <Router history={history}>
          <Switch>
            <SecuredRoute exact path="/" component={Dashboard} />
            <Route
              exact
              path="/auth/login"
              render={() => <RedirectToHome path={`${urls.auth}auth/login`} />}
            />
            <Route
              exact
              path="/auth/signup"
              render={() => (
                <RedirectToHome path={`${urls.auth}/auth/signup`} />
              )}
            />
            <SecuredRoute exact path="/users" component={Users} />
            <SecuredRoute
              exact
              path="/users/instructor"
              component={InstructorComponent}
            />
            <SecuredRoute
              exact
              path="/users/admin"
              component={AdminComponent}
            />
            <SecuredRoute exact path="/categories" component={Categories} />

            <SecuredRoute exact path="/courses" component={Courses} />
            <SecuredRoute exact path="/courses/:id" component={CourseView} />

            <SecuredRoute exact path="/sections" component={Sections} />
            <SecuredRoute exact path="/lectures" component={Lectures} />
            <SecuredRoute
              exact
              path="/lectures/rejectedlectures"
              component={RejectedLectures}
            />

            <SecuredRoute exact path="/ratings" component={Ratings} />

            <SecuredRoute exact path="/pages" component={SitePages} />
            <SecuredRoute exact path="/orders" component={Orders} />

            <SecuredRoute exact path="/enrollments" component={Enrollments} />
            <SecuredRoute exact path="/localization" component={Localization} />
            <SecuredRoute
              exact
              path="/paymentTransaction"
              component={PaymentTransaction}
            />
            <SecuredRoute exact path="/settings" component={Settings} />
            <SecuredRoute exact path="/coupons" component={Coupon} />
            <SecuredRoute exact path="/bankmethods" component={BankMethod} />
            <SecuredRoute
              exact
              path="/notifications"
              component={Notifications}
            />
            <Route
              exact
              path="*"
              render={() => <RedirectToHome path={`${urls.auth}/auth/login`} />}
            />
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
