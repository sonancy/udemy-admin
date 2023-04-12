import React, { Component } from "react";
import { Row, Col, Card, CardBody, Alert } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
import * as _ from "lodash";
import Loader from "react-loader-spinner";

// login user
import { signup } from "../../redux/auth/actionCreator";

// import images
import logoSm from "../../assets/images/logo-sm.png";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    // handleValidSubmit
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
  }

  // handleValidSubmit
  handleValidSubmit(event, values) {
    this.props.signup(values);
  }

  render() {
    console.log("this.porps====", this.props.user);
    return (
      <React.Fragment>
        <div className="account-pages my-5 pt-5">
          <div className="container">
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <div className="position-relative">
                  <Card className="overflow-hidden">
                    <div className="bg-primary">
                      <div className="text-primary text-center p-4">
                        <h5 className="text-white font-size-20">Welcome !</h5>
                        <p className="text-white-50">
                          Create New Account in Learnify to Begin journey
                        </p>
                        <Link to="/" className="logo logo-admin">
                          <img src={logoSm} height="24" alt="logo" />
                        </Link>
                      </div>
                    </div>

                    <CardBody className="p-4">
                      <div className="p-3">
                        <AvForm
                          className="form-horizontal mt-4"
                          onValidSubmit={this.handleValidSubmit}
                        >
                          {this.props.error ? (
                            <Alert color="danger">{this.props.error}</Alert>
                          ) : null}

                          <div className="form-group">
                            <AvField
                              name="firstName"
                              label="First Name"
                              type="text"
                              required
                              placeholder="Enter FirstName"
                            />
                          </div>
                          <div className="form-group">
                            <AvField
                              name="lastName"
                              label="Last Name"
                              type="text"
                              required
                              placeholder="Enter LastName"
                            />
                          </div>
                          <div className="form-group">
                            <AvField
                              name="email"
                              label="Email"
                              className="form-control"
                              placeholder="Enter email"
                              type="email"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <AvField
                              name="username"
                              label="userName"
                              type="text"
                              required
                              placeholder="Enter Username"
                            />
                          </div>
                          <div className="form-group">
                            <AvField
                              name="password"
                              label="Password"
                              type="password"
                              required
                              placeholder="Enter Password"
                            />
                          </div>

                          <Row className="form-group">
                            <Col sm={6}>&nbsp;</Col>
                            <Col sm={6} className="text-right">
                              {this.props.loading === false ? (
                                <button
                                  className="btn btn-primary w-md waves-effect waves-light"
                                  type="submit"
                                  disabled={this.props.loading}
                                >
                                  Sign Up
                                </button>
                              ) : (
                                <button
                                  className="btn btn-primary w-md waves-effect waves-light"
                                  type="submit"
                                  disabled={this.props.loading}
                                >
                                  <Loader
                                    type="TailSpin"
                                    color="#fff"
                                    height={20}
                                    width={20}
                                  />
                                </button>
                              )}
                            </Col>
                          </Row>
                          <div className="mt-5 text-center">
                            <p>
                              Already have an account ?{" "}
                              <Link
                                to="/auth/login"
                                className="font-weight-medium text-primary"
                              >
                                {" "}
                                Login now{" "}
                              </Link>{" "}
                            </p>
                          </div>
                        </AvForm>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    loading: state.auth.loading,
  };
};

export default withRouter(connect(mapStateToProps, { signup })(Signup));
