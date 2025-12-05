import Vue from "vue";
import Router from "vue-router";
import LoginIn from "@/pages/LoginIn";
import SignUp from "@/pages/SignUp";
import Home from "@/pages/Home";
import SongList from "@/pages/SongList";
import Singer from "@/pages/Singer";
import MyMusic from "@/pages/MyMusic";
import SongListAlbum from "@/pages/SongListAlbum";
import SingerAlbum from "@/pages/SingerAlbum";
import Search from "@/pages/Search";
import Setting from "@/pages/Setting";
import Lyric from "@/pages/Lyric";
import store from "../store/index"; // 🔥 1. 引入 store 以便获取登录状态

Vue.use(Router);

// 🔥 2. 将 router 实例赋值给一个变量，而不是直接 export
const router = new Router({
  routes: [
    {
      path: "*",
      redirect: "/404",
    },
    {
      path: "/404",
      component: (resolve) => require(["../pages/404.vue"], resolve),
    },
    {
      path: "/login-in",
      name: "login-in",
      component: LoginIn,
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: SignUp,
    },
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/song-list",
      name: "song-list",
      component: SongList,
    },
    {
      path: "/my-music",
      name: "my-music",
      component: MyMusic,
      meta: { requireAuth: true }, // 🔥 3. 关键修改：标记该页面需要登录权限
    },
    {
      path: "/song-list-album/:id",
      name: "song-list-album",
      component: SongListAlbum,
    },
    {
      path: "/singer",
      name: "singer",
      component: Singer,
    },
    {
      path: "/singer-album/:id",
      name: "singer-album",
      component: SingerAlbum,
    },
    {
      path: "/lyric/:id",
      name: "lyric",
      component: Lyric,
    },
    {
      path: "/search",
      name: "search",
      component: Search,
    },
    {
      path: "/setting",
      name: "setting",
      component: Setting,
      meta: { requireAuth: true }, // 🔥 3. 关键修改：标记该页面需要登录权限
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});

// 🔥 4. 添加全局路由守卫
router.beforeEach((to, from, next) => {
  // 检查目标路由是否需要登录权限
  if (to.meta.requireAuth) {
    // 获取登录状态：优先从 Vuex 获取，防止刷新丢失再从 sessionStorage 获取
    const isLogin =
      store.getters.loginIn ||
      JSON.parse(window.sessionStorage.getItem("loginIn"));

    if (isLogin) {
      // 已登录，放行
      next();
    } else {
      // 未登录，强制跳转到登录页
      next({
        path: "/login-in",
        query: { redirect: to.fullPath }, // (可选) 将来登录成功后可以跳回原页面
      });
    }
  } else {
    // 不需要权限的页面，直接放行
    next();
  }
});

export default router;
