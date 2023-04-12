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

const initialState = {
  user: null,
  loading: false,
  error: null,
  token: null,
};

const AUTH = (state = initialState, actions) => {
  const { payload, error, type } = actions;
  switch (type) {
    case LOGIN_BEGIN: {
      return { ...state, loading: true, user: null, token: null };
    }
    case LOGIN_SUCCESS: {
      return { ...state, loading: false, user: payload, token: payload.token };
    }
    case LOGIN_FAIl: {
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        error: error,
      };
    }
    case SIGNUP_BEGIN: {
      return { ...state, loading: true, user: null, token: null };
    }
    case SIGNUP_SUCCESS: {
      return { ...state, loading: false, user: payload };
    }
    case SIGNUP_FAIl: {
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        error: error,
      };
    }
    case ADD_USER_BEGIN: {
      return {
        ...state,
        loading: true,
        error: null,
        user: null,
      };
    }
    case ADD_USER_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        user: payload,
      };
    }
    case ADD_USER_FAIL: {
      return {
        ...state,
        loading: false,
        error,
        user: null,
      };
    }
    default:
      return state;
  }
};

export default AUTH;
