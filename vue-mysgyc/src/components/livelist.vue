<template>
  <div class="newslist">
      <div class="listHead">
          <div style="width:0.3rem;height:100%;display:flex;align-items:center;" @click="gback"><label class="backIcon"></label></div>
          <div class="listTitle">直播列表</div>
          <label> </label>
      </div>
      <div class="listBody" ref="container">
            <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" style="width:100%;">
              <mu-list>
                  <div class="listUnit" v-for="item in list" :key="item.id" @click="newsdetails(item.type,item.id)">
                    <div class="unitLeft">
                        <img class="unitimg" :src="imgdomain+item.thumb">
                        <label class="playicon"></label>
                    </div>
                    <div class="unitRight">
                        <div class="unittitle">{{item.title}}</div>
                        <div v-if="item.houselivestatus==1" class="prelive livestatus">预告</div>
                        <div v-else-if="item.houselivestatus==2" class="living livestatus">直播</div>
                        <div v-else-if="item.houselivestatus==3" class="lived livestatus">回看</div>
                        <div class="unittime">{{item.created_at | timestampToTimes}}</div>
                    </div>
                </div>
              </mu-list>
            </mu-load-more>
      </div>
  </div>
</template>

<script>
import { timestampToTimes } from "../assets/js/common.js"; //时间戳转换时间
import axios from 'axios'
export default {
  name: 'newslist',
  data () {
    return {
      imgdomain:'http://o.cztvcloud.com/',
      num: 10,
      refreshing: false,
      loading: false,
      list:[],
      id:'',
      curpage:1
    }
  },
  filters: {
    timestampToTimes(time) {
        return timestampToTimes(time);
    }
  },
  mounted(){
    document.getElementsByTagName('body')[0].style.position = '';
    this.id = this.$route.query.id;
    this.getList(this.id);
  },
  methods: {
    //获取列表
    getList(){
       axios.get(
            onlinedomain+"/media/latest?category_id="+this.id+"&sort=1&size=10&page=1&channel_id="+channel_id
        )
        .then(response => {
          this.list  = response.data.data.list;
          console.log(this.list)
        })
        .catch(error => {
          console.log(error);
        });
    },
    refresh () {
      this.refreshing = true;
      this.$refs.container.scrollTop = 0;
      setTimeout(() => {
        this.curpage = 1;
        this.getList(this.id);
        this.refreshing = false;
      }, 500)
    },
    //加载更多
    load () {
      this.curpage++;
      this.loading = true;
      setTimeout(() => {
        axios.get(
            onlinedomain+"/media/latest?category_id="+this.id+"&sort=1&size=10&page="+this.curpage+"&channel_id="+channel_id
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
      }, 500)
    },
    //返回上一页
    gback(){
        this.$router.go(-1)
    },
    //跳转详情页
    newsdetails(type,id){
      if(type=='video'){
        this.$router.push({
          path: "/videodetails",
          query: {
            "id": id
          }
        });
      }else{
        this.$router.push({
          path: "/newsdetails",
          query: {
            "id": id,
            "type":type
          }
        });
      }
    }
  }
}
</script>

<style scpoe>
.listHead{
    width:100%;
    height:0.72rem;
    background: #fff;
    padding: 0 0.1rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.backIcon{
    height:0.21rem;
    width:0.12rem;
    background: url(../assets/images/backicon.png);
    background-size: 100% 100%;
    display: block;
}
.listTitle{
    font-size:22px;
    color:#3F4F77;
}
.listUnit{
    width:100%;
    height:1.1rem;
    background: #fff;
    margin-top:0.1rem;
    padding:0.1rem;
    box-sizing: border-box;
}
.unitLeft{
    width:1.56rem;
    height:100%;
    position:relative;
    float:left;
}
.playicon{
  display: block;
  width:0.4rem;
  height: 0.4rem;
  background: url(../assets/images/playicon.png);
  background-size: 100% 100%;
  position:absolute;
  left:calc(50% - 0.2rem);
  top:calc(50% - 0.2rem);
}
.listimg{
    width:100%;
    height:100%;
    background: #3F4F77;
}
.unitRight{
    width:calc(100% - 1.56rem);
    height:100%;
    float:left;
    padding:0 0.1rem;
    box-sizing: border-box;
    position: relative;
}
.unittitle{
    width:100%;
    height:0.44rem;
    line-height:0.22rem;
    font-size:0.16rem;
    overflow: hidden;
}
.unittime{
    position:absolute;
    font-size:0.16rem;
    right: 0.1rem;
    bottom:-0.04rem;
    color:#949494
}
.livestatus{
    width:0.42rem;
    height:0.17rem;
    border-radius: 0.7rem;
    text-align: center;
    line-height: 0.18rem;
    color:#fff;
    font-size:0.12rem;
    position:absolute;
    left:0.1rem;
    bottom: 0;
}
.prelive{
    background: #4DA6FE;
}
.living{
    background: #27AD88;
}
.lived{
    background: #FE7C28;
}
.unitimg{
  width:100%;
  height:100%;
}
.listBody{
  padding:0;
}
</style>
