import {
  LOGIN_BEGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIl,
  SIGNUP_BEGIN,
  SIGNUP_SUCCESS,
  SIGNUP_FAIl,
  ADD_USER_BEGIN,
  ADD_USER_SUCCESS,
  ADD_USER_FAIL,
} from "./types";

export const loginBegin = () => {
  return {
    type: LOGIN_BEGIN,
  };
};

export const loginSuccess = (payload) => {
  return {
    type: LOGIN_SUCCESS,
    payload,
  };
};

export const loginFail = (error) => {
  return {
    type: LOGIN_FAIl,
    error,
  };
};

export const signupBegin = () => {
  return {
    type: SIGNUP_BEGIN,
  };
};

export const signupSuccess = (payload) => {
  return {
    type: SIGNUP_SUCCESS,
    payload,
  };
};

export const signupFail = (error) => {
  return {
    type: SIGNUP_FAIl,
    error,
  };
};

export const addUserBegin = () => {
  return {
    type: ADD_USER_BEGIN,
  };
};

export const addUserSuccess = (payload) => {
  return {
    type: ADD_USER_SUCCESS,
    payload,
  };
};
export const addUserFail = (error) => {
  return {
    type: ADD_USER_FAIL,
    error,
  };
};
