/* eslint-disable */
import axios from "axios";
import { Message } from "element-ui";

// 1. 创建 axios 实例
const service = axios.create({
  // 根据你的环境配置，这里保持你原有的逻辑
  baseURL: "http://localhost:8085/music",
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  },
});

// 2. 处理登录过期
function handleLoginExpire() {
  // 防止短时间内重复弹出提示
  if (document.querySelector(".el-message--error")) return;

  Message.error({
    message: "请登录！",
    duration: 2000,
  });

  // 清除所有本地缓存
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("avator");
  localStorage.removeItem("user");
  sessionStorage.removeItem("loginIn");

  // 延迟跳转，让用户看清提示
  setTimeout(() => {
    // 强制跳转到登录页
    window.location.href = "/login-in";
  }, 1000);
}

// 3. 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 兼容后端返回 200 但 code=401 的情况
    if (response.data.code === 401) {
      handleLoginExpire();
      return Promise.reject("登录过期");
    }
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          handleLoginExpire();
          break;
        case 403:
          handleLoginExpire();
          break;
        case 404:
          Message.error("请求的接口不存在");
          break;
        case 500:
          Message.error("服务器内部错误");
          break;
        default:
          Message.error(`网络请求失败 (${error.response.status})`);
      }
    } else {
      Message.error("网络连接超时或异常");
    }
    return Promise.reject(error);
  }
);

// 5. 导出封装方法
export function get(url, params = {}) {
  return service.get(url, { params });
}

export function post(url, data = {}) {
  return service.post(url, data);
}

export function deletes(url, data = {}) {
  return service.delete(url, { data });
}

export function put(url, data = {}) {
  return service.put(url, data);
}

export default service;
