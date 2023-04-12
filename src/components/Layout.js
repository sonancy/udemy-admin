import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

// Other Layout related Component
import RightSidebar from "./RightSidebar";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpened: false,
    };
    this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
  }

  /**
   * Open/close right sidebar
   */
  toggleRightSidebar() {
    this.props.toggleRightSidebar();
  }

  componentDidMount() {
    // Scrollto 0,0
    window.scrollTo(0, 0);

    const title = this.props.location.pathname;
  }

  /**
   * Opens the menu - mobile
   */
  openMenu = (e) => {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
  };

  render() {
    return (
      <React.Fragment>
        <div id="layout-wrapper">
          <TopBar
            theme={this.props.topbarTheme}
            isMenuOpened={this.state.isMenuOpened}
            toggleRightSidebar={this.toggleRightSidebar}
            openLeftMenuCallBack={this.openMenu}
          />
          <Navbar menuOpen={this.state.isMenuOpened} />

          <div className="main-content">
            <div className="page-content">{this.props.children}</div>
          </div>
          <RightSidebar />
        </div>
      </React.Fragment>
    );
  }
}

export default connect()(withRouter(Layout));
