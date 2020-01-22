<template>
  <div class="index" ref="index" v-loading="load">
    <topBanner :fxz="111" @openshadow="getOpen"></topBanner>
    <div class="indexBody">
      <mu-load-more :loading="loading" @load="loadmore" @refresh="refresh" :refreshing="refreshing">
        <!-- 轮播 -->
        <div class="lunboBox">
          <mu-carousel hide-controls style="width:100%;height:100%;">
            <mu-carousel-item v-for="item in lbtlist" :key="item.id" class="lbpage">
              <img
                :src="imgdomain + item.thumb"
                @click="
                  item.redirect_url == '' || item.redirect_url == null
                    ? newsdetails(item.type, item.id)
                    : redirect(item.redirect_url)
                "
              />
            </mu-carousel-item>
          </mu-carousel>
        </div>
        <div class="newsBox">
          <div class="insidenewsBox" ref="container">
            <mu-list>
              <div
                class="newsUnit"
                v-for="item in cgbdlist"
                :key="item.id"
                @click="newsdetails(item.type, item.id)"
              >
                <div class="unitLeft" v-if="item.thumb">
                  <img class="unitimg" :src="imgdomain + item.thumb" />
                  <label v-if="item.data_template_id > 0 || item.type == 'video'" class="playicon"></label>
                </div>
                <div
                  class="untiRight"
                  :style="
                    item.thumb ? 'width:calc(100% - 1.3rem)' : 'width:100%'
                  "
                >
                  <div class="unitTitle">{{ item.title }}</div>
                  <div class="hit">
                    <div class="eye"></div>
                    {{ item.hits_fake }}
                  </div>
                  <div class="unittime" v-cloak>{{ item.created_at | timestampToTimes }}</div>
                </div>
              </div>
            </mu-list>
          </div>
        </div>
      </mu-load-more>
    </div>
    <botBanner></botBanner>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import topBanner from "../components/Top-banner.vue";
import botBanner from "../components/Bot-banner.vue";
export default {
  name: "index",
  data() {
    return {
      imgdomain: "http://o.cztvcloud.com/",
      loading: false,
      text: "List",
      lbtlist: [],
      cgbdbig: [],
      cgbdlist: [],
      curpage: 1,
      open: false,
      docked: false,
      position: "right",
      slide: "",
      load: false,
      title: "",
      refreshing: false
    };
  },
  components: {
    botBanner,
    topBanner
  },
  mounted() {
    this.loadFun();
  },
  beforeRouteEnter(to, from, next) {
    window.document.title = "新蓝网三改一拆频道";
    next();
  },
  watch: {
    //防止菜单底部页面滑动
    open(n, o) {
      if (n) {
        document.getElementsByTagName("body")[0].style.position = "fixed";
      } else {
        document.getElementsByTagName("body")[0].style.position = "";
      }
    }
  },
  methods: {
    //获取遮罩信息
    getOpen(v) {
      console.log(v);
    },
    //初始化
    loadFun() {
      this.curpage = 1;
      this.getInfo();
      this.getList();
      this.load = true;
      let i = 0;
    },
    //菜单
    openMenu() {
      this.open = !this.open;
    },
    //获取首页数据
    getInfo() {
      let _this = this;
      let infoObj = {
        lbt: this.$axios.get(
          onlinedomain +
            "/media/latest?category_id=" +
            category_id.lbt +
            "&sort=1&size=6&page=1&channel_id=" +
            channel_id
        ),
        cgbd: this.$axios.get(
          onlinedomain +
            "/media/latest?category_id=" +
            category_id.cgbd +
            "&sort=1&size=5&page=1&channel_id=" +
            channel_id
        )
      };
      this.$axios.all([infoObj.lbt, infoObj.cgbd]).then(
        this.$axios.spread(function(lbt, cgbd) {
          _this.lbtlist = lbt.data.data.list;
          if (cgbd.data.data.list.length > 0) {
            _this.cgbdbig = cgbd.data.data.list[0];
          }
          _this.load = false;
          //微信分享
          fenxiang(
            "新蓝网三改一拆频道", //标题
            "浙江广播电视集团—新蓝网三改一拆频道", //描述
            "http://o.cztvcloud.com/275/6068152/images/wxshare.png", //图片
            window.location.href
          );
          window.scrollTo(0, 0);
        })
      );
    },
    getList() {
      // this.$axios
      //   .get(
      //     onlinedomain +
      //       "/media/latest?category_id=" +
      //       category_id.cgbd +
      //       "&sort=1&size=10&page=" +
      //       this.curpage +
      //       "&channel_id=" +
      //       channel_id
      //   )
      //   .then(response => {
      //     this.cgbdlist = response.data.data.list;
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
      var promise = new Promise((resolve, reject) => {
        let url1 =
          onlinedomain +
          "/media/latest?category_id=" +
          category_id.cgbd +
          "&sort=1&size=10&page=" +
          this.curpage +
          "&channel_id=" +
          channel_id;
        this.$get(url1, {})
          .then(response => {
            if (response.code == 200) {
              console.log("第一个接口 ", response);
              this.cgbdlist = response.data.list;
              resolve();
            } else {
              reject();
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
      promise.then(res => {
        let url2 =
          onlinedomain +
          "/media/latest?category_id=" +
          category_id.cgcx +
          "&sort=1&size=10&page=" +
          this.curpage +
          "&channel_id=" +
          channel_id;
        this.$get(url2, {})
          .then(res => {
            console.log("第二个接口");
            // resolve(res);
          })
          .catch(err => {
            console.log(err);
          });
      });
      promise.catch(error => {
        console.log("wrong", error);
      });
    },
    //打开外链
    redirect(url) {
      window.open(url);
    },
    //跳转详情页
    newsdetails(type, id) {
      if (type == "video") {
        this.$router.push({
          path: "/videodetails",
          query: {
            id: id
          }
        });
      } else {
        this.$router.push({
          path: "/newsdetails",
          query: {
            id: id,
            type: type
          }
        });
      }
    },
    //跳转列表
    listFun(id) {
      this.$router.push({
        path: "/newslist",
        query: {
          id: id
        }
      });
    },
    //跳转直播列表
    hostlist(id) {
      this.$router.push({
        path: "/hostlist",
        query: {
          id: id
        }
      });
    },
    //下拉刷新
    refresh() {
      this.refreshing = true;
      this.$refs.container.scrollTop = 0;
      this.curpage = 1;
      this.getInfo();
      this.getList();
      let i = 0;
      this.refreshing = false;
    },
    //加载更多
    loadmore() {
      this.curpage++;
      this.loading = true;
      setTimeout(() => {
        this.$axios
          .get(
            onlinedomain +
              "/media/latest?category_id=" +
              category_id.cgbd +
              "&sort=1&size=10&page=" +
              this.curpage +
              "&channel_id=" +
              channel_id
          )
          .then(response => {
            this.cgbdlist = this.cgbdlist.concat(response.data.data.list);
            if (this.curpage > response.data.data.pages) {
              this.loading = false; // 若数据已全部获取完毕
            }
          })
          .catch(error => {
            console.log(error);
          });
        this.loading = false;
      }, 500);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
}
.headlogo {
  width: 1.2rem;
  height: 0.34rem;
}
.headlogo img {
  width: 100%;
  height: 100%;
}
.menuBtn {
  display: inline-block;
  width: 0.26rem;
  height: 0.22rem;
  background-image: url(../assets/images/menu.png);
  background-size: 100% 100%;
  vertical-align: bottom;
  margin-left: 0.08rem;
}
.menuTitle {
  font-size: 0.14rem;
  color: #7e7e7e;
}
.menulogo {
  display: inline-block;
  width: 0.19rem;
  height: 0.19rem;
  background-size: 100% 100%;
}
.btnBox {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.mu-item-action {
  min-width: 0.3rem;
}
.indexBody {
  padding: 0.1rem;
  box-sizing: border-box;
  padding-top: 0;
  margin-top: 0.7rem;
  margin-bottom: 0.5rem;
}
.lunboBox {
  width: 100%;
  height: 1.98rem;
  margin-bottom: 0.2rem;
}
.topBtn {
  width: 0.52rem;
  height: 0.52rem;
  display: inline-block;
  background-size: 100% 100%;
}
.botBtn {
  font-size: 0.14rem;
  color: #000;
}
.btnUnit {
  width: calc(100% / 4);
  text-align: center;
  margin-bottom: 0.2rem;
  font-size: 0.14rem;
}
.rollLine {
  width: 100%;
  height: 0.24rem;
}
.rollIcon {
  width: 0.16rem;
  height: 0.16rem;
  background-image: url(../assets/images/rollicon.png);
  background-size: 100% 100%;
  vertical-align: middle;
  margin-right: 0.05rem;
  float: left;
}
.rollTitle {
  width: 0.65rem;
  font-size: 0.14rem;
  float: left;
}
.rollNumber {
  width: calc(100% - 0.65rem - 0.05rem - 0.16rem - 0.2rem);
  height: 100%;
  float: left;
  margin: 0 0.1rem;
  position: relative;
  z-index: 0;
  overflow: hidden;
}
.rollinside {
  width: 200%;
  height: 100%;
  line-height: 0.24rem;
  overflow: auto;
  position: absolute;
  left: 100%;
  animation: slide 5s linear infinite;
  animation-fill-mode: both;
}
@keyframes slide {
  0% {
    left: 100%;
  }
  100% {
    left: -110%;
  }
}
.rollinside span {
  padding: 0 0.2rem;
  font-size: 0.14rem;
  font-weight: bold;
}
.hotBox {
  width: 100%;
  height: 1.02rem;
  border-radius: 0.05rem;
  box-shadow: 0px 2px 4px 1px #0003;
  margin-top: 0.12rem;
  padding: 0.2rem 0.15rem;
  box-sizing: border-box;
  position: relative;
  z-index: 0;
}
.hoticon {
  width: 0.11rem;
  height: 0.18rem;
  background-image: url(../assets/images/hoticon.png);
  background-size: 100% 100%;
  display: block;
  position: absolute;
  left: 0;
  top: calc(50% - 0.09rem);
}
.hottitle {
  width: 100%;
  height: 100%;
  font-size: 0.22rem;
  line-height: 0.31rem;
  overflow: hidden;
}
.newsUnit {
  width: 100%;
  height: 1rem;
  border-bottom: 1px solid #e7e7e7;
  padding-bottom: 0.15rem;
  margin-top: 0.15rem;
  box-sizing: border-box;
}
.unitLeft {
  width: 1.3rem;
  height: 100%;
  position: relative;
  z-index: 0;
  float: left;
}
.playicon {
  display: block;
  width: 0.4rem;
  height: 0.4rem;
  background: url(../assets/images/playicon.png);
  background-size: 100% 100%;
  position: absolute;
  left: calc(50% - 0.2rem);
  top: calc(50% - 0.2rem);
}
.unitimg {
  width: 100%;
  height: 100%;
  background: #0003;
}
.untiRight {
  width: calc(100% - 1.3rem);
  height: 100%;
  float: left;
  padding-left: 0.06rem;
  box-sizing: border-box;
  position: relative;
  z-index: 0;
}
.unitTitle {
  width: 100%;
  height: 0.44rem;
  line-height: 0.22rem;
  font-size: 0.16rem;
  overflow: hidden;
}
.unittime {
  font-size: 0.14rem;
  position: absolute;
  right: 0.1rem;
  bottom: -0.05rem;
}
.lbpage img {
  width: 100%;
  height: 100%;
}
.mu-icon-button {
  padding: 0 !important;
  width: inherit !important;
}
.mu-carousel {
  z-index: 0;
}
.mu-carousel-indicators {
  bottom: -12px !important;
}
.mu-drawer {
  width: 1.8rem !important;
}
.mu-overlay {
  overflow: hidden;
}
.hit {
  font-size: 0.14rem;
  position: absolute;
  bottom: -0.1rem;
  padding-left: 0.2rem;
  left: 0.1rem;
}
.eye {
  width: 18px;
  height: 10px;
  background-image: url(../assets/images/eye.png);
  background-size: 100% 100%;
  position: absolute;
  left: 0;
  top: 0.05rem;
}
</style>
