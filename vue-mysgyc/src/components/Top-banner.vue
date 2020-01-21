<template>
  <div class="indexHead">
    <!-- 头部logo -->
    <div class="headlogo">
      <img src="http://o.cztvcloud.com/275/6068152/images/waplogo.png" />
    </div>
    <!-- 隐藏菜单 -->
    <div class="hidemenubox">
      <span class="menuTitle">导航</span>
      <label class="menuBtn" @click="openMenu"></label>
      <mu-drawer :open.sync="open" :docked="docked" :right="position === 'right'">
        <mu-list toggle-nested>
          <mu-list-item button :ripple="true" nested @click="open = false">
            <mu-list-item-action>
              <label class="menulogo menu_0"></label>
            </mu-list-item-action>
            <mu-list-item-title>首页</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button :ripple="true" nested @click="(open = false), listFun('15124')">
            <mu-list-item-action>
              <label class="menulogo menu_1"></label>
            </mu-list-item-action>
            <mu-list-item-title>拆改要闻</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button :ripple="true" nested @click="(open = false), listFun('15123')">
            <mu-list-item-action>
              <label class="menulogo menu_2"></label>
            </mu-list-item-action>
            <mu-list-item-title>拆改报道</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button :ripple="true" nested @click="(open = false), listFun('15125')">
            <mu-list-item-action>
              <label class="menulogo menu_3"></label>
            </mu-list-item-action>
            <mu-list-item-title>拆改专题</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button :ripple="true" nested @click="(open = false), listFun('15412')">
            <mu-list-item-action>
              <label class="menulogo menu_4"></label>
            </mu-list-item-action>
            <mu-list-item-title>拆改成效</mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-drawer>
    </div>
  </div>
</template>

<script>
export default {
  name: "Top-banner",
  data() {
    return {
      open: true,
      docked: false,
      position: "right"
    };
  },
  methods: {
    //菜单
    openMenu() {
      this.open = !this.open;
    }
  }
};
</script>

<style scoped>
.indexHead {
  width: 100%;
  height: 0.7rem;
  padding: 0.1rem;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0;
  padding-top: 0;
  background: #fff;
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
.menu_0 {
  background-image: url(../assets/images/menu_0.png);
}
.menu_1 {
  background-image: url(../assets/images/menu_1.png);
}
.menu_2 {
  background-image: url(../assets/images/menu_2.png);
}
.menu_3 {
  background-image: url(../assets/images/menu_3.png);
}
.menu_4 {
  background-image: url(../assets/images/menu_4.png);
}
.mu-overlay {
  overflow: hidden;
}
</style>
