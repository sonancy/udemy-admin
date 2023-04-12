import {
  addUserBegin,
  addUserFail,
  addUserSuccess,
} from "./actions";
import base from "../../apis/points";
import api from "../../apis/api";

export const getCurrentUser = () => async (dispatch) => {
  dispatch(addUserBegin());
  const response = await api.get(base.me);
  dispatch(addUserSuccess(response.data.data.user));
  return function () {
    return Promise.resolve(response);
  };
};
