import cookies from "react-cookies";

export const saveCookie = (key, value) => {
  return cookies.save(key, value, {
    path: "/",
  });
};

export const getCookie = (key) => {
  return cookies.load(key, {
    path: "/",
  });
};

export const removeCookie = (key) => {
  return cookies.remove(key, {
    path: "/",
  });
};
