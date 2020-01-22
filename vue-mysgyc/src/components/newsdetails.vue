<template>
  <div class="newsdetails" v-loading="load">
    <div class="detailstHead">
      <div @click="gback" style="width:0.3rem;height:100%;display:flex;align-items:center;">
        <label class="backIcon"></label>
      </div>
      <div class="listTitle"></div>
      <div class="headlogo" @click="index">
        <img src="http://o.cztvcloud.com/275/6068152/images/waplogo.png" />
      </div>
    </div>
    <div class="detailsBody">
      <div class="detailttitle">{{data.title}}</div>
      <div class="detailsInfoline">
        <div v-if="data.referer" class="source">{{data.referer_author}}</div>
        <div v-else class="source">原创</div>
        <!-- <div class="hitd">浏览量：{{data.hits_fake}}</div> -->
        <div class="time" v-cloak>{{data.created_at | timestampToTimes}}</div>
      </div>
      <!-- 视频播放器 -->
      <div v-if="data.play_url || data.liveurl" class="videobox" id="videobox" ref="player"></div>
      <!-- 引用图集 -->
      <div class="albumscom" v-if="data.data_data">
        <div
          class="imgBox"
          v-for="item in data.data_data"
          :key="item.id"
          @click="albumFun(item.data_id)"
        >
          <img style="width:100%;" :src="imgdomain+item.thumb" />
          <div>{{item.title}}</div>
        </div>
      </div>
      <!-- 正文内容 -->
      <div class="detailscon" v-html="data.content"></div>
      <!-- 图集详情 -->
      <div class="albumdetails" v-if="album">
        <div class="imgBox" v-for="item in data.images" :key="item.id">
          <img style="width:100%;" :src="imgdomain+item.path" />
          <div>{{item.intro}}</div>
        </div>
      </div>
    </div>
    <div class="footPic">
      <img
        style="height:100%;width:auto;"
        src="http://o.cztvcloud.com/269/5703168/images/logofoot.jpg"
      />
    </div>
  </div>
</template>

<script>
// window.location.reload();
import { timestampToTimes } from "../assets/js/common.js"; //时间戳转换时间
import axios from "axios";
export default {
  metaInfo: {
    // title: "标题停停停停停停"
  },
  name: "newsdetails",
  data() {
    return {
      imgdomain: "http://o.cztvcloud.com/",
      webdomain: "http://localhost:8081/#/",
      id: "",
      type: "",
      data: {},
      album: {},
      load: false
    };
  },
  filters: {
    timestampToTimes(time) {
      return timestampToTimes(time);
    }
  },
  props: ["idd", "typee"],
  mounted: function() {
    document.getElementsByTagName("body")[0].style.position = "";
    this.load = true;
    // this.id = this.$route.params.id;
    // this.type = this.$route.params.type;
    this.id = this.idd;
    this.type = this.typee;
    this.getNews(this.type, this.id);
  },
  destroyed() {
    if (window.qcplayer) {
      window.qcplayer.fullscreen(false);
    }
  },
  methods: {
    //浏览量
    analysis(channelId, itemId, title, editorId, terminal, type) {
      axios
        .get(
          onlinedomain +
            "/visit/ie?channel_id=" +
            channelId +
            "&item_id=" +
            itemId +
            "&title=" +
            title +
            +"&editor_id=" +
            editorId +
            +"&terminal=" +
            terminal +
            +"&type=" +
            type
        )
        .then(res => {
          console.log("统计回调成功");
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取详情
    getNews(type, id) {
      if (type == "news") {
        axios
          .get(
            onlinedomain +
              "/media/news?data_id=" +
              id +
              "&terminal=web&channel_id=" +
              channel_id
          )
          .then(response => {
            if (response.data.code == 200) {
              this.data = response.data.data;
              document.title = this.data.title;
              this.load = false;
              //浏览量
              this.analysis(
                channel_id,
                this.data.data_id,
                this.data.title,
                this.data.author_id,
                "wap",
                1
              );
              //加载播放器
              if (this.data.play_url || this.data.liveurl) {
                var url =
                  (this.data.play_url ? this.data.play_url : "") +
                  (this.data.liveurl ? this.data.liveurl : "");
                var thumb = this.data.thumb;
                var options = {
                  mp4: url,
                  autoplay: false,
                  live: false,
                  width: "100%",
                  height: "100%",
                  controls: "default",
                  coverpic: {
                    style: "cover",
                    src: this.imgdomain + thumb
                  }
                };
                setTimeout(function() {
                  var player = new TcPlayer("videobox", options);
                  window.qcplayer = player;
                  player.fullscreen(false);
                  // alert(player.fullscreen())
                }, 1000);
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else if (type == "album") {
        axios
          .get(
            onlinedomain +
              "/media/album?data_id=" +
              id +
              "&terminal=web&channel_id=" +
              channel_id
          )
          .then(response => {
            if (response.data.code == 200) {
              this.data = response.data.data;
              document.title = this.data.title;
              //浏览量
              this.analysis(
                channel_id,
                this.data.data_id,
                this.data.title,
                this.data.author_id,
                "wap",
                1
              );
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
      setTimeout(() => {
        this.load = false;
        //微信分享
        fenxiang(
          document.title, //标题
          "浙江广播电视集团—新蓝网三改一拆频道", //描述
          "http://o.cztvcloud.com/275/6068152/images/wxshare.png", //图片
          window.location.href
        );
      }, 500);
      window.scrollTo(0, 0);
    },
    //跳转图集详情
    albumFun(id) {
      window.open(this.webdomain + "newsdetails?id=" + id + "&type=album");
    },
    //返回上一页
    gback() {
      this.$router.go(-1);
      if (window.qcplayer) {
        window.qcplayer.fullscreen(false);
      }
    },
    index() {
      this.$router.push({
        path: "/"
      });
    }
  }
};
</script>

<style scpoe>
html,
body {
  background: #fff;
}
img {
  width: 100%;
}
.detailstHead {
  width: 100%;
  height: 0.52rem;
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
  font-size: 22px;
  color: #3f4f77;
}
.detailsBody {
  min-height: 6rem;
  background: #fff;
}
.detailttitle {
  width: 100%;
  padding: 0 0.2rem;
  font-size: 0.24rem;
  line-height: 0.34rem;
  font-weight: bold;
  word-break: break-all;
}
.detailsInfoline {
  width: 100%;
  padding: 0 0.2rem;
  display: flex;
  justify-content: space-between;
  margin-top: 0.1rem;
}
.source {
  font-size: 0.14rem;
  color: #3f4f77;
}
.hitd {
  font-size: 0.14rem;
  color: #949494;
}
.time {
  font-size: 0.14rem;
  color: #949494;
}
.videobox {
  width: 100%;
  height: 2.12rem;
  margin-top: 0.22rem;
  background: #3f4f77;
}
.detailscon {
  width: 100%;
  padding: 0 0.2rem;
  font-size: 0.16rem;
  line-height: 0.3rem;
  margin-top: 0.15rem;
  word-break: break-all;
}
.albumscom,
.albumdetails {
  width: 100%;
  padding: 0 0.2rem;
  margin-top: 0.15rem;
}
.imgBox {
  margin-bottom: 0.2rem;
}
.footPic {
  width: 100%;
  height: 0.66rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #222;
}
.headlogo {
  width: 1.22rem;
  height: 0.34rem;
  padding-top: 0.05rem;
}
</style>
