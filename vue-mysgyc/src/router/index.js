import Vue from "vue";
import Router from "vue-router";
import index from "@/view/index";
import newslist from "@/components/newslist";
import livelist from "@/components/livelist";
import newsdetails from "@/components/newsdetails";
import videodetails from "@/components/videodetails";

Vue.use(Router);


export default new Router({
    routes: [{
            path: "/",
            name: "index",
            component: index,
            meta: {
                keepAlive: true
            }
        },
        {
            path: "/newslist",
            props: route => ({
                idd: route.query.id
            }), //获取到?后面的参数id，并通过在此组件内引入props的方式调用该数据
            name: "newslist",
            component: newslist,
            meta: {
                keepAlive: true
            }
        },
        {
            path: "/livelist",
            name: "livelist",
            component: livelist
        },
        {
            path: "/newsdetails",
            props: route => ({
                idd: route.query.id,
                typee: route.query.type
            }), //获取到?后面的参数id和type
            name: "newsdetails",
            component: newsdetails
        },
        {
            path: "/videodetails",
            name: "videodetails",
            component: videodetails
        }
    ],
    mode: "hash",
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {
                x: 0,
                y: 0
            };
        }
    }
});