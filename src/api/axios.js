import axios from "axios";
import { toast } from "react-toastify";
import { getCookie } from "../utils/cookies";

const baseURL = "http://127.0.0.1:8000/api/";

const client = axios.create({
  baseURL,
  headers: {
    Authorization: getCookie("token"),
  },
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    toast.error(err.response.data.message);
  }
);

export default client;
