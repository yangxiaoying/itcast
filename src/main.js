// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss";

Vue.use(ElementUI);
Vue.config.productionTip = false;

// 全局守卫
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("mytoken");
  if (token) {
    // 已登录
    next();
  } else {
    // 未登录
    if (to.path !== "/login") {
      next({ path: "/login" });
    } else {
      next();
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
