var ua = {
    //3
    android: false,
    android2: false,
    iphone: false,
    ipad: false,
    pc: false,
    wechat: false,
    chinabluenews: false
};
(function() {
    var ua_str = window.navigator.userAgent.toLowerCase();
    if (/micromessenger/.test(ua_str)) {
        ua.wechat = true;
        ua.chinabluenews = false;
    }
})();

function fenxiang(a, b, e, l) {
    if (ua.wechat) {
        $.getJSON(
            "http://sso.cztvcloud.com/weixin_share/share?channel_id=181&callback=?", { url: location.href },
            function(msg) {
                if (msg.success) {
                    wx.config({
                        debug: false,
                        appId: msg.appId,
                        timestamp: msg.timestamp,
                        nonceStr: msg.nonceStr,
                        signature: msg.signature,
                        jsApiList: [
                            "onMenuShareTimeline",
                            "onMenuShareAppMessage",
                            "onMenuShareQQ",
                            "onMenuShareWeibo"
                        ]
                    });
                }
                wx.ready(function() {
                    var news_title = a;
                    var news_link = l;
                    //'http://house.cztv.com/m?from=singlemessage&isappinstalled=0#/newsdetails?source=1&id=5156716';
                    //https://xihu.cztvcloud.com/m#/wldetails?id=5154236
                    //http://house.cztv.com/m#/newsdetails?source=1&id=5156716
                    var news_image = e;
                    var news_intro = b;
                    wx.onMenuShareTimeline({
                        title: news_title,
                        link: news_link,
                        imgUrl: news_image
                    });
                    wx.onMenuShareAppMessage({
                        title: news_title,
                        desc: news_intro,
                        link: news_link.split("#")[0] +
                            "?from=singlemessage&isappinstalled=0" +
                            "#" +
                            news_link.split("#")[1],
                        imgUrl: news_image
                    });
                    wx.onMenuShareQQ({
                        title: news_title,
                        desc: news_intro,
                        link: news_link,
                        imgUrl: news_image
                    });
                    wx.onMenuShareWeibo({
                        title: news_title,
                        desc: news_intro,
                        link: news_link,
                        imgUrl: news_image
                    });
                });
            }
        );
    }
}