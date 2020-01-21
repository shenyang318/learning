<template>
  <mu-load-more :loading="loading" @load="loadmore" @refresh="refresh" :refreshing="refreshing">
    <div class="newsBox">
      <div class="insidenewsBox" ref="container">
        <mu-list>
          <div
            class="newsUnit"
            v-for="item in list"
            :key="item.title"
            @click="newsdetails(item.type, item.id)"
          >
            <div class="unitLeft" v-if="item.thumb">
              <img class="unitimg" :src="imgdomain + item.thumb" />
              <label v-if="item.data_template_id > 0 || item.type == 'video'" class="playicon"></label>
            </div>
            <div class="untiRight" :style="item.thumb ? 'width:calc(100% - 1.3rem)' : 'width:100%'">
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
</template>

<script>
export default {
  name: "list",
  data() {
    return {
      loading: false,
      refreshing: false,
      imgdomain: "http://o.cztvcloud.com/",
      list: this.cgbdlist
    };
  },
  mounted() {},
  props: ["cgbdlist"],
  methods: {
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
            this.list = this.cgbdlist.concat(response.data.data.list);
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

<style scoped>
.newsUnit {
  width: 100%;
  height: 1rem;
  border-bottom: 1px solid #e7e7e7;
  padding-bottom: 0.15rem;
  margin-top: 0.15rem;
  box-sizing: border-box;
  position: relative;
  z-index: -1;
}
.unitLeft {
  width: 1.3rem;
  height: 100%;
  position: relative;
  z-index: -1;
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
  z-index: -1;
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
</style>
