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
import { login } from "../../redux/auth/actionCreator";

// import images
import logoSm from "../../assets/images/logo-sm.png";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    // handleValidSubmit
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
  }

  // handleValidSubmit
  handleValidSubmit(event, values) {
    this.props.login(values.email, values.password);
  }

  render() {
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
                        <h5 className="text-white font-size-20">
                          Welcome Back !
                        </h5>
                        <p className="text-white-50">
                          Sign in to continue to Learnify.
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
                                  Log In
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
                          {/* <Row className="form-group mt-2 mb-0">
                            <div className="col-12 mt-4">
                              <Link to="/forget-password">
                                <i className="mdi mdi-lock"></i> Forgot your
                                password?
                              </Link>
                            </div>
                          </Row> */}
                        </AvForm>
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <div className="mt-5 text-center">
                  <p>
                    Don't have an account ?{" "}
                    <Link
                      to="/auth/signup"
                      className="font-weight-medium text-primary"
                    >
                      Signup now
                    </Link>
                  </p>
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

export default withRouter(connect(mapStateToProps, { login })(Login));
