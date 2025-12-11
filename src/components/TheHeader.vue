<template>
  <div class="the-header">
    <!--图标-->
    <div class="header-logo" @click="goHome">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-erji"></use>
      </svg>
      <span>{{ musicName }}</span>
    </div>
    <ul class="navbar" ref="change">
      <li
        :class="{ active: item.name === activeName }"
        v-for="item in navMsg"
        :key="item.path"
        @click="goPage(item.path, item.name)"
      >
        {{ item.name }}
      </li>
      <li>
        <div class="header-search">
          <input
            type="text"
            placeholder="搜索音乐"
            @keyup.enter="goSearch()"
            v-model="keywords"
          />
          <div class="search-btn" @click="goSearch()">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-sousuo"></use>
            </svg>
          </div>
        </div>
      </li>
      <li
        v-if="!loginIn"
        :class="{ active: item.name === activeName }"
        v-for="item in loginMsg"
        :key="item.type"
        @click="goPage(item.path, item.name)"
      >
        {{ item.name }}
      </li>
    </ul>
    <!--设置-->
    <div class="header-right" v-show="loginIn">
      <div id="user">
        <img :src="attachImageUrl(avator)" alt="" />
      </div>
      <ul class="menu">
        <li
          v-for="(item, index) in menuList"
          :key="index"
          @click="goMenuList(item.path)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mixin } from "../mixins";
import { mapGetters } from "vuex";
import { navMsg, loginMsg, menuList } from "../assets/data/header";
import { signOut } from "../api/index"; // 【1. 引入 signOut 方法】

export default {
  name: "the-header",
  mixins: [mixin],
  data() {
    return {
      musicName: "music",
      navMsg: [], // 左侧导航栏
      loginMsg: [], // 右侧导航栏
      menuList: [], // 用户下拉菜单项
      keywords: "",
    };
  },
  computed: {
    ...mapGetters(["userId", "activeName", "avator", "username", "loginIn"]),
  },
  created() {
    this.navMsg = navMsg;
    this.loginMsg = loginMsg;
    this.menuList = menuList;
  },
  mounted() {
    document.querySelector("#user").addEventListener(
      "click",
      function (e) {
        document.querySelector(".menu").classList.add("show");
        e.stopPropagation();
      },
      false
    );
    // 点击“菜单”内部时，阻止事件冒泡。(这样点击内部时，菜单不会关闭)
    document.querySelector(".menu").addEventListener(
      "click",
      function (e) {
        e.stopPropagation();
      },
      false
    );
    document.addEventListener(
      "click",
      function () {
        document.querySelector(".menu").classList.remove("show");
      },
      false
    );
  },
  methods: {
    goHome() {
      this.$router.push({ path: "/" });
    },
    goPage(path, value) {
      document.querySelector(".menu").classList.remove("show");
      this.changeIndex(value);
      if (!this.loginIn && path === "/my-music") {
        this.notify("请先登录", "warning");
      } else {
        this.$router.push({ path: path });
      }
    },
    changeIndex(value) {
      this.$store.commit("setActiveName", value);
    },
    goMenuList(path) {
      if (path === 0) {
        this.$store.commit("setIsActive", false);
      }
      document.querySelector(".menu").classList.remove("show");

      if (path) {
        this.$router.push({ path: path });
      } else {
        // 【2. 修改退出逻辑】
        // 先调用后端退出接口
        signOut()
          .then((res) => {
            // 无论后端返回成功与否，前端都执行清理操作
            this.$message.success(res.msg || "退出成功");
            this.clearSession();
          })
          .catch((err) => {
            console.log(err);
            // 即使请求失败（比如网络问题），前端也要强制退出
            this.clearSession();
          });
      }
    },
    // 【3. 抽离清理逻辑】
    clearSession() {
      this.$store.commit("setLoginIn", false);
      this.$store.commit("setUserId", null); // 建议同时也清空Vuex里的用户ID
      this.$store.commit("setUsername", null);
      this.$store.commit("setAvator", null);

      // 清除本地缓存（双重保险）
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("avator");
      sessionStorage.removeItem("loginIn");

      // 刷新页面或跳转首页
      this.$router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
    goSearch() {
      this.$store.commit("setSearchword", this.keywords);
      this.$router.push({
        path: "/search",
        query: { keywords: this.keywords },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/the-header.scss";
</style>
