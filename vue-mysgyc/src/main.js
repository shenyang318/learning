// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router"; //相当于./router/index.js
import Vuex from "vuex";
import Meta from "vue-meta";
import axios from "axios";
// import creatStore from "./store/store";

import "muse-ui/lib/styles/base.less";
import "muse-ui-loading/dist/muse-ui-loading.css";
import "muse-ui-progress/dist/muse-ui-progress.css";
import Helpers from "muse-ui/lib/Helpers";
import Loading from "muse-ui-loading";
import "muse-ui/lib/styles/theme.less";
import {
    Carousel,
    List,
    LoadMore,
    Menu,
    Drawer,
    Progress
} from "muse-ui";
import {
    get,
    post
} from "./assets/js/api"

import {
    timestampToTimes
} from "./assets/js/common"
Vue.use(Carousel);
Vue.use(List);
Vue.use(LoadMore);
Vue.use(Menu);
Vue.use(Drawer);
Vue.use(Loading);
Vue.use(Progress);
Vue.use(Helpers);
Vue.use(Meta);
Vue.use(Vuex);

Vue.config.productionTip = false;

//Vue.prototype是在vue构造函数的原型上定义一个方法或属性，使其在每个Vue中的实例中可用，
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$axios = axios;
// axios.defaults.baseURL = "http://localhost:8088/apit";

//全局过滤器注册，直接在标签中使用
Vue.filter('timestampToTimes', timestampToTimes)


new Vue({
    router, //不简写就是router:router //将路由实例挂载到根实例上，从而让整个应用都有路由功能，通过这种方式，我们可以在任何组件内通过 this.$router 访问路由器，也可以通过 this.$route访问当前路由对象：
    render: h => h(App)
}).$mount("#app");