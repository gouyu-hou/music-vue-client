"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 🔥 确保本地也能跑通
  API_HOST: '"http://localhost:8085"',
});
