import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000
});

request.interceptors.request.use(
  function (config) {
    console.log("发送请求：", config.url);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    console.error("请求失败：", error);
    return Promise.reject(error);
  }
);

export default request;