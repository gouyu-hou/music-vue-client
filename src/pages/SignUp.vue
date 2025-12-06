<template>
  <div class="signUp-page">
    <loginLogo />
    <div class="signUp">
      <div class="signUp-head">
        <span>用户注册</span>
      </div>
      <el-form
        :model="registerForm"
        status-icon
        :rules="rules"
        ref="registerForm"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="registerForm.username"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            type="password"
            placeholder="密码"
            v-model="registerForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="registerForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="phoneNum" label="手机">
          <el-input
            placeholder="手机"
            v-model="registerForm.phoneNum"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="registerForm.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="birth" label="生日">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="registerForm.birth"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="introduction" label="签名">
          <el-input
            type="textarea"
            placeholder="签名"
            v-model="registerForm.introduction"
          ></el-input>
        </el-form-item>
        <el-form-item prop="location" label="地区">
          <el-select
            v-model="registerForm.location"
            placeholder="地区"
            style="width: 100%"
          >
            <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="login-btn">
          <el-button @click="goback(-1)">取消</el-button>
          <el-button type="primary" @click="SignUp">确定</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import loginLogo from "../components/LoginLogo";
import { mixin } from "../mixins";
import { rules, cities } from "../assets/data/form";
import { SignUp } from "../api/index";

export default {
  name: "SignUp-page",
  components: {
    loginLogo,
  },
  mixins: [mixin],
  data() {
    return {
      registerForm: {
        // 注册
        username: "",
        password: "",
        sex: "",
        phoneNum: "",
        email: "",
        birth: "",
        introduction: "",
        location: "",
      },
      rules: {},
      cities: [],
    };
  },
  created() {
    this.rules = rules;
    this.cities = cities;
  },
  methods: {
    SignUp() {
      let _this = this;
      // --- 修复开始 ---
      let d = new Date(this.registerForm.birth);
      // 确保月份和日期是两位数 (yyyy-MM-dd)
      let month = (d.getMonth() + 1).toString().padStart(2, '0');
      let day = d.getDate().toString().padStart(2, '0');
      let datetime = d.getFullYear() + "-" + month + "-" + day;
      // --- 修复结束 ---
      
      let params = new URLSearchParams();
      params.append("username", this.registerForm.username);
      // ... 其他代码保持不变
      params.append("password", this.registerForm.password);
      params.append("sex", this.registerForm.sex);
      params.append("phoneNum", this.registerForm.phoneNum);
      params.append("email", this.registerForm.email);
      params.append("birth", datetime);
      params.append("introduction", this.registerForm.introduction);
      params.append("location", this.registerForm.location);
      params.append("avator", "/music/img/user.jpg");
      //调用api中SignUp的函数、发起请求
      SignUp(params)
    .then((res) => {
      console.log(res);
      if (res.code === 1) {
        _this.notify("注册成功", "success");
        setTimeout(function () {
          _this.$router.push({ path: "/" });
        }, 2000);
      } else {
        // 🔥🔥🔥 修改这里：优先显示后端返回的 msg 错误信息
        // 如果 res.msg 存在，就显示它（比如"手机号格式错误"），否则显示默认的"注册失败"
        _this.notify(res.msg || "注册失败", "error");
      }
    })
    .catch((err) => {
      console.log(err);
    });
    },
    goback(index) {
      this.$router.go(index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/sign-up.scss";
</style>
