// 时间戳转换
function timestampToTimes(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + "-";
    var M =
        (date.getMonth() + 1 < 10 ?
            "0" + (date.getMonth() + 1) :
            date.getMonth() + 1) + "-";
    var D = date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
    var h = date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":";
    var m = date.getMinutes() < 10 ? "0" + date.getMinutes() + ":" : date.getMinutes(); //":";
    //   var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m
}

//px rem 转换
function pxtorem() {
    // 基准大小
    const baseSize = 32;
    // 设置 rem 函数
    function setRem() {
        // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
        const scale = document.documentElement.clientWidth / 750
            // 设置页面根节点字体大小
        document.documentElement.style.fontSize = (baseSize * Math.min(scale, 2)) + 'px'
    }
    // 初始化
    setRem();
    // 改变窗口大小时重新设置 rem
    window.onresize = function() {
        setRem();
    }
};


export {
    timestampToTimes,
    pxtorem
};