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

// 2. 处理登录过期 (核心修复)
function handleLoginExpire() {
  // 防止短时间内重复弹出提示
  if (document.querySelector(".el-message--error")) return;

  Message.error({
    message: "请登录！",
    duration: 2000,
  });

  // 【核心修复步骤 1】清除 localStorage (用户信息)
  // 对应 src/store/user.js 中的存储键名
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("avator");
  localStorage.removeItem("user"); // 防止有其他别名，一并清除

  // 【核心修复步骤 2】清除 sessionStorage (登录状态)
  // 对应 src/store/configure.js 中的存储键名
  // 如果不清除这个，页面刷新后 Header 依然认为你已登录，从而隐藏注册按钮
  sessionStorage.removeItem("loginIn");

  // 也可以选择直接清空所有缓存，最彻底
  // sessionStorage.clear();

  // 【核心修复步骤 3】跳转逻辑
  setTimeout(() => {
    // 强制刷新并跳转到登录页（根据你的路由配置，"/" 是登录页）
    // 使用 location.href 可以确保 Vuex 状态被完全重置，避免按钮显示异常
    window.location.href = "/";
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
          // 403 有时也是 token 失效
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

// 5. 导出封装方法 (保持原有结构以便兼容)
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
