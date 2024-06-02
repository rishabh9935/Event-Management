import axios from "axios";
import Cookies from "js-cookie";

const axiosPost = async (url, data) => {
  const token = Cookies.get("access_token");
  console.log(token);

  let headers = {};

  if (token)
    headers = {
      Authorization: `Bearer ${token}`,
    };

  const resp = await axios.post(url, data, {
    headers: headers,
  });

  return resp;
};

const axiosGet = async (url) => {
  const token = Cookies.get("access_token");
  console.log(token);

  let headers = {};

  if (token)
    headers = {
      Authorization: `Bearer ${token}`,
    };

  const resp = await axios.get(url, {
    headers: headers,
  });

  return resp;
};

const axiosPut = async (url, data) => {
  const token = Cookies.get("access_token");
  console.log(token);

  let headers = {};

  if (token)
    headers = {
      Authorization: `Bearer ${token}`,
    };

  const resp = await axios.put(url, data, {
    headers: headers,
  });

  return resp;
};

const axiosDelete = async (url) => {
  const token = Cookies.get("access_token");
  console.log(token);

  let headers = {};

  if (token)
    headers = {
      Authorization: `Bearer ${token}`,
    };

  const resp = await axios.delete(url, {
    headers: headers,
  });

  return resp;
};

export { axiosGet, axiosPost, axiosPut, axiosDelete };
