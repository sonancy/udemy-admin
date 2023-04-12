import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import MetisMenu from "metismenujs";

import SimpleBar from "simplebar-react";

const SidebarContent = (props) => {
  return (
    <div id="sidebar-menu">
      <ul className="metismenu list-unstyled" id="side-menu">
        <li className="menu-title">Main</li>

        <li>
          <Link to="/" className="waves-effect">
            <i className="ti-home"></i>
            <span>Home</span>
          </Link>
        </li>

        <li className="menu-title">User</li>
        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="far fa-user"></i>
            <span>Users</span>
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/users">All Users</Link>
            </li>
            <li>
              <Link to="/users/instructor">Instructors</Link>
            </li>
            <li>
              <Link to="/users/admin">Admin</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="fas fa-th-large"></i>
            <span>Category</span>
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/categories">All Categories</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="fas fa-book-open"></i>
            <span>Courses</span>
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/courses">All Courses</Link>
            </li>
            <li>
              <Link to="/courses?status=pending">Pending Courses</Link>
            </li>
            <li>
              <Link to="/courses?status=rejected">Rejected Courses</Link>
            </li>
            <li>
              <Link to="/courses?status=published">published Courses</Link>
            </li>
            <li>
              <Link to="/courses?status=in-review">Review Courses</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="fas fa-clipboard-list"></i>
            <span>Sections</span>
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/sections">All Section</Link>
            </li>

            {/* <li>
              <Link to="/sections/sectionsT">SectionsT</Link>
            </li> */}
          </ul>
        </li>

        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="ion ion-ios-journal"></i>
            <span>Lectures</span>
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/lectures">All Lectures</Link>
            </li>
            <li>
              <Link to="/lectures?status=rejected">Rejected Lectures</Link>
            </li>
            <li>
              <Link to="/lectures?status=approved">Approved Lectures</Link>
            </li>
            <li>
              <Link to="/lectures?status=pending">Pending Lectures</Link>
            </li>
            <li>
              <Link to="/lectures?status=published">published Lectures</Link>
            </li>
            <li>
              <Link to="/lectures?status=draft">Draft Lectures</Link>
            </li>
          </ul>
        </li>

        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="far fa-star"></i>
            <span>Ratings</span>
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/ratings">All Ratings</Link>
            </li>
          </ul>
        </li>
        {/* <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="far fa-star"></i>
            <span>Notifications</span>
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/notifications">All Notifications</Link>
            </li>
          </ul>
        </li> */}
        {/* <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="fas fa-comment-dots"></i>
            <span>Comments</span>
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/#">All Comments</Link>
            </li>
          </ul>
        </li> */}
        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="fas fa-wallet"></i>
            <span>wallets</span>
          </Link>
          <ul className="sub-menu">
            {/* <li>
              <Link to="ui-alerts">All wallets</Link>
            </li> */}
            <li>
              <Link to="/bankmethods">All Bank Accounts</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="far fa-gem"></i>
            <span>Coupons</span>
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/coupons">All Coupons</Link>
            </li>
          </ul>
        </li>

        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="fas fa-box-open"></i>
            <span>Orders</span>
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/orders">All Orders</Link>
            </li>
            <li>
              <Link to="/orders?status=paid">paid Orders</Link>
            </li>
            <li>
              <Link to="/orders?status=rejected">Rejected Orders</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="fas fa-id-card-alt"></i>
            <span>Enrollments</span>
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/enrollments">All Enrollments</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="fab fa-buffer"></i>
            <span>Other</span>
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/paymentTransaction">All Payment Transactions</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="fas fa-sliders-h"></i>
            <span>Site</span>
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <Link to="/localization">Localizations</Link>
            </li>
            <li>
              <Link to="/pages">pages</Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initMenu();
  }

  componentDidUpdate(prevProps) {
    if (this.props.type !== prevProps.type) {
      this.initMenu();
    }
  }

  initMenu() {
    if (this.props.type !== "condensed" || this.props.isMobile) {
      new MetisMenu("#side-menu");

      var matchingMenuItem = null;
      var ul = document.getElementById("side-menu");
      var items = ul.getElementsByTagName("a");
      for (var i = 0; i < items.length; ++i) {
        if (this.props.location.pathname === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  activateParentDropdown = (item) => {
    item.classList.add("mm-active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active"); // li
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  };

  render() {
    return (
      <React.Fragment>
        {this.props.type !== "condensed" ? (
          <SimpleBar style={{ maxHeight: "100%" }}>
            <SidebarContent />
          </SimpleBar>
        ) : (
          <SidebarContent />
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Sidebar);
