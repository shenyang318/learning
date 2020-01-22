import Vue from "vue";
import Router from "vue-router"; //引入router组件
import index from "@/view/index";
import livelist from "@/components/livelist";
import videodetails from "@/components/videodetails";

Vue.use(Router); //加载全局组件,这样vue-router才开始执行.

const routes = [{
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
        component: resolve => require(['@/components/newslist'], resolve), //路由懒加载:单页面应用,首页时,加载内容时间过长.运用懒加载对页面组件进行划分,减少首页加载时间,此时component则不需要在第一步import
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
        component: resolve => require(['@/components/newsdetails'], resolve),

    },
    {
        path: "/videodetails",
        name: "videodetails",
        component: videodetails
    }
]
const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
        return savedPosition;
    } else {
        return {
            x: 0,
            y: 0
        };
    }
}

//创建路由实例
const router = new Router({
        //base:'/',//基路径:默认值为'/'.如果整个单页应用在/app/下,base就应该设为'/app/'.一般可以写成__dirname,在webpack中配置.
        mode: 'history',
        routes,
        scrollBehavior
    })
    //导出
export default router