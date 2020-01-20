<template>
  <div class="newslist">
    <div class="listHead">
      <div
        style="width:0.3rem;height:100%;display:flex;align-items:center;"
        @click="gback"
      >
        <label class="backIcon"></label>
      </div>
      <div class="listTitle">{{ listname }}</div>
      <label></label>
    </div>
    <div class="listBody" ref="container">
      <mu-load-more
        @refresh="refresh"
        :refreshing="refreshing"
        :loading="loading"
        @load="load"
      >
        <mu-list>
          <div
            class="listUnit"
            v-for="item in list"
            :key="item.id"
            @click="newsdetails(item.type, item.id)"
          >
            <div class="unitLeft" v-if="item.thumb">
              <img class="unitimg" :src="imgdomain + item.thumb" />
              <label
                v-if="item.data_template_id > 0 || item.type == 'video'"
                class="playicon"
              ></label>
            </div>
            <div
              class="unitRight"
              :style="item.thumb ? 'width:calc(100% - 1.56rem)' : 'width:100%'"
            >
              <div class="unittitle">{{ item.title }}</div>
              <div class="hit">
                <!-- <div class="eye"></div>
                {{ item.hits_fake }} -->
              </div>
              <div class="unittime">
                {{ item.created_at | timestampToTimes }}
              </div>
            </div>
          </div>
        </mu-list>
      </mu-load-more>
    </div>
  </div>
</template>

<script>
import { timestampToTimes } from "../assets/js/common.js"; //时间戳转换时间
import axios from "axios";
export default {
  name: "newslist",
  data() {
    return {
      imgdomain: "http://o.cztvcloud.com/",
      refreshing: false,
      loading: false,
      list: [],
      id: "",
      curpage: 1,
      listname: ""
    };
  },
  props: ["idd"],
  filters: {
    timestampToTimes(time) {
      return timestampToTimes(time);
    }
  },
  mounted() {
    this.refreshing = true;
    this.id = this.idd;
    this.getList(this.id);
    if (this.id == "15124") {
      this.listname = "拆改要闻";
    } else if (this.id == "15123") {
      this.listname = "拆改报道";
    } else if (this.id == "15125") {
      this.listname = "拆改专题";
    } else if (this.id == "15412") {
      this.listname = "拆改成效";
    }
  },
  beforeRouteEnter(to, from, next) {
    window.document.title = "";
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == "/") {
      //如果目标页是首页，择不缓存列表页
      from.meta.keepAlive = false;
    } else if (to.path == "/newsdetails" || from.path == "/videodetails") {
      //如果目标页是详情页，择缓存当前列表页
      from.meta.keepAlive = true;
    }
    next();
  },
  methods: {
    //获取列表
    getList() {
      axios
        .get(
          onlinedomain +
            "/media/latest?category_id=" +
            this.id +
            "&sort=1&size=10&page=1&channel_id=" +
            channel_id
        )
        .then(response => {
          this.list = response.data.data.list;
          setTimeout(() => {
            this.refreshing = false;
          }, 500);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //下拉刷新
    refresh() {
      this.refreshing = true;
      this.$refs.container.scrollTop = 0;
      setTimeout(() => {
        this.curpage = 1;
        this.getList(this.id);
        this.refreshing = false;
      }, 500);
    },
    //加载更多
    load() {
      this.curpage++;
      this.loading = true;
      setTimeout(() => {
        axios
          .get(
            onlinedomain +
              "/media/latest?category_id=" +
              this.id +
              "&sort=1&size=10&page=" +
              this.curpage +
              "&channel_id=" +
              channel_id
          )
          .then(response => {
            this.list = this.list.concat(response.data.data.list);
            if (this.curpage > response.data.data.pages) {
              this.loading = false; // 若数据已全部获取完毕
            }
          })
          .catch(error => {
            console.log(error);
          });
        this.loading = false;
      }, 500);
    },
    //返回上一页
    gback() {
      this.$router.go(-1);
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
    }
  }
};
</script>

<style scpoe>
.listHead {
  width: 100%;
  height: 0.72rem;
  background: #fff;
  padding: 0 0.1rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.backIcon {
  height: 0.21rem;
  width: 0.12rem;
  background: url(../assets/images/backicon.png);
  background-size: 100% 100%;
  display: block;
}
.listTitle {
  font-size: 0.22rem;
  color: #3f4f77;
}
.listUnit {
  width: 100%;
  height: 1.1rem;
  background: #fff;
  margin-top: 0.1rem;
  padding: 0.1rem;
  box-sizing: border-box;
}
.unitLeft {
  width: 1.56rem;
  height: 100%;
  position: relative;
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
.listimg {
  width: 100%;
  height: 100%;
  background: #3f4f77;
}
.unitRight {
  width: calc(100% - 1.56rem);
  height: 100%;
  float: left;
  padding: 0 0.1rem;
  box-sizing: border-box;
  position: relative;
}
.unittitle {
  width: 100%;
  height: 0.44rem;
  line-height: 0.22rem;
  font-size: 0.16rem;
  overflow: hidden;
}
.unittime {
  position: absolute;
  font-size: 0.14rem;
  right: 0.1rem;
  bottom: 0;
  color: #949494;
}
.unitimg {
  width: 100%;
  height: 100%;
}
.hit {
  font-size: 0.14rem;
  position: absolute;
  bottom: 0rem;
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
