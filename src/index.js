import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Store from "./redux/Store.component";
import { ToastContainer } from "react-toastify";
import "antd/dist/antd.css";
import "./assets/scss/theme.scss";
import "react-toastify/dist/ReactToastify.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "video-react/dist/video-react.css";

ReactDOM.render(
  <Store>
    <ToastContainer style={{ zIndex: 77777777777 }} />
    <App />
  </Store>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
