import React, { Component } from "react";
import { Link } from "react-router-dom";

import {
  DropdownItem,
  DropdownMenu,
  Dropdown,
  DropdownToggle,
} from "reactstrap";

// import images
import logodarkImg from "../../assets/images/logo-dark.png";
import logosmImg from "../../assets/images/logo-sm.png";
import logolightImg from "../../assets/images/logo-light.png";

// Import other Dropdown
import LanguageDropdown from "../../components/LanguageDropdown";
import NotificationDropdown from "../../components/NotificationDropdown";
import ProfileMenu from "../../components/ProfileMenu";

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchOpen: false,
    };

    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
  }

  /**
   * Toggle Search
   */
  toggleSearch() {
    this.setState({ isSearchOpen: !this.state.isSearchOpen });
  }

  /**
   * Toggle sidebar
   */
  toggleMenu() {
    this.props.toggleMenuCallback();
  }

  /**
   * Toggle full screen
   */
  toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box">
                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <h1 className="text-white">L</h1>
                  </span>
                  <span className="logo-lg">
                    <h1 className="text-white">Learnify</h1>
                  </span>
                </Link>

                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <h1 className="text-white">L</h1>
                  </span>
                  <span className="logo-lg">
                    <h1 className="text-white">Learnify</h1>
                  </span>
                </Link>
              </div>
              <button
                type="button"
                onClick={this.toggleMenu}
                className="btn btn-sm px-3 font-size-24 header-item waves-effect"
                id="vertical-menu-btn"
              >
                <i className="mdi mdi-menu"></i>
              </button>
            </div>

            <div className="d-flex">
              <div className="dropdown d-none d-lg-inline-block">
                <button
                  type="button"
                  className="btn header-item noti-icon waves-effect"
                  onClick={this.toggleFullscreen}
                  data-toggle="fullscreen"
                >
                  <i className="mdi mdi-fullscreen"></i>
                </button>
              </div>

              {/* <NotificationDropdown /> */}

              <ProfileMenu />
            </div>
          </div>
        </header>
      </React.Fragment>
    );
  }
}

export default TopBar;
