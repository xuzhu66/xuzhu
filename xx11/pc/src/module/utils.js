import router from '@/router/Router';
import store from '@/store/Store';
// state.aliOssObj
import { ClientJS } from 'clientjs';
/**
 * 事件函数
 */
//换肤加class函数
import md5 from "js-md5"; // 加密

export function toggleClass(element, className) {
    if (!element || !className) {
        return
    }
    element.className = className;
}

/**
 * md5加盐加密
 * @param {String} a 传进来的字符串
 */
export function mymd5(a) {
    let saltstart = "W$!", //定义一个salt值，程序员规定下来的随机字符串
        saltlast = "*&g@5", //定义一个salt值，程序员规定下来的随机字符串
        b = saltstart + a + saltlast; //把密码和salt连接
    b = md5(b); //执行MD5散列
    return b; //返回散列
}

/**
 * 格式化手机号 3 4 4
 * @param {String} n 传进来的手机号码
 */
export function formatTelNo(n) {
    if (!n) return;
    n = n.replace(/\s+/g, "");
    let resArr = [];
    let num = n.split("");
    for (let i = 0; i < num.length; i++) {
        resArr.push(num[i]);
        if (i == 2) {
            resArr.push(" ");
        } else if ((i - 2) % 4 == 0) {
            resArr.push(" ");
        }
    }
    n = resArr.join("");
    return n.replace(/^\s+|\s+$/g, "");
}

/**
 * 去除所有空对象key值
 * @param {Object} obj 传进来的对像
 */
export function deletObjKey(obj) {
    for (const key in obj) {  // 去除对象内多余的空值key
        if (obj[key] === "" || obj[key] === null) {
            delete obj[key]
        }
    }
    return obj;
}

/**
 * 银行卡4位个空格
 * @param {String} str
 */
export function spacesForma(str) {
    return (str || 0).toString().replace(/(.)(?=(?:.{4})+$)/g, "$1 ");
}

/**
 * 除前三, 后四位可见, 其它转 * 不可见
 * @param {String} str
 */
export function numHidf3l4(str) {
    if (!str) {
        return '';
    }
    let reg = /^(.{3})(.*)(.{4})$/,
        s = "",
        f4 = "",
        e4 = "";
    str = str.replace(reg, function (a, b, c, d) {
        f4 = b;
        e4 = d;
        s = c.replace(/./g, "*");
    });
    return f4 + " " + spacesForma(s) + " " + e4 + "";
}

/**
 * 除前三, 后四位可见, 其它转 * 不可见
 * @param {String} str
 */
export function numHidf4l4(str) {
    if (!str) {
        return '';
    }
    let reg = /^(.{3})(.*)(.{4})$/,
        s = "",
        f4 = "",
        e4 = "";
    str = str.replace(reg, function (a, b, c, d) {
        f4 = b;
        e4 = d;
        s = c.replace(/./g, "*");
    });
    return f4 + "************" + e4;
}


/**
 * 金额格式化 小数点后两位，千分位
 * @param {Number} v 传进来的数字
 */
export function formatAmount_bak(v) {
    let vv = v
    if (v && isNaN(v)) vv = v.replace(/,/g, '')
    let num = decimalForma(vv, 100)
    if (!num) num = '0'
    return num
}

// 有小数保留两位小数; 没有小数取整
export function formatAmount(value) {
    if (value.toString() == '' || value == undefined || value == Number.MAX_VALUE) {
        value = 0;
    }
    if (isNaN(value)) {
        return 0;
    }
    if (typeof value !== "number") {
        return value;
    }
    let num;
    // 判断最后两位小数是不是大于零
    let decimal = Number(value) - Math.trunc(Number(value))
    if (decimal === 0) {
        num = Number((Math.floor(Number(value) * 100) / 100).toFixed(0));
    } else {
        // 解决number格式化两位小数的时候少一位的问题; 所以在最后补0.0001,这样格式话只保留两位, 就不会出现不精确的问题了;
        let point = String(value).indexOf('.') + 1;   //小数点的位置
        let last = String(value).length - point;  //小数的位数
        // if(last == 2){
        //     value = value + 0.0001
        // }
        // 解决小数不准确的问题
        value = value + 0.0001
        num = Number((Math.floor(Number(value) * 100) / 100).toFixed(2));
    }
    return num;
}

export function thousandBitForma(str) { // 千分位
    return (str || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
}

export function decimalForma_bak(num, float) {
    let f = 1;
    if (float) f = float;
    if (isNaN(num)) return;
    let fLen = f.toString().length - 1;
    let total = 0, // 预定义返回变量
        n = Math.floor(parseFloat(num * f).toFixed(fLen)); // 数值 * 转换的小数位
    let zs = (Math.floor(n * f) / f).toString(); // 整数部分
    let s = f + "",
        slen = s.length - 1 - zs.length;
    let xs = zs.substring(zs.length - fLen, zs.length); // 小数部分
    if (slen > 0) {
        for (let i = 0; i < slen; i++) {
            xs = `0${xs}`;
        }
    }
    zs = parseInt(zs / f);
    if (f == 1) {
        total = thousandBitForma(zs);
    } else {
        total = thousandBitForma(zs) + "." + thousandBitForma(xs); // 返回保留两位小数的值
    }
    return total; // 返回转换后带小数位的值
}

export function decimalForma(num, float) {
    let f = 1;
    if (float) f = float;
    if (isNaN(num)) return;
    let fLen = f.toString().length - 1;
    let total = 0, // 预定义返回变量
        n = Math.floor(parseFloat(num * f).toFixed(fLen)); // 数值 * 转换的小数位
    let zs = (Math.floor(n * f) / f).toString(); // 整数部分
    let s = f + "",
        slen = s.length - 1 - zs.length;
    let xs = zs.substring(zs.length - fLen, zs.length); // 小数部分
    if (slen > 0) {
        for (let i = 0; i < slen; i++) {
            xs = `0${xs}`;
        }
    }
    zs = parseInt(zs / f);
    if (f == 1) {
        total = thousandBitForma(zs);
    } else {
        let spstr = xs.split('');
        let send1 = spstr[spstr.length - 1];
        let send2 = spstr[spstr.length - 2];
        if (send1 == 0 && send2 == 0) {
            total = thousandBitForma(zs); // 返回保留两位小数的值
        } else {
            if (send1 == 0) {
                total = thousandBitForma(zs) + "." + thousandBitForma(send2); // 返回保留两位小数的值
            } else {
                total = thousandBitForma(zs) + "." + thousandBitForma(xs); // 返回保留两位小数的值
            }
        }
    }
    return total; // 返回转换后带小数位的值
}

/**
 * 返回纯数字 通过正则过滤小数点后两位
 * @param {Number, Number}
 * e 传来的数字
 * n 最长几位
 */
export function resNum(e, n) {
    e.target.value = (e.target.value.match(/^[0-9|\s]*/g)[0]) || null
    if (e.target.value.length > n) {
        return e.target.value = e.target.value.substring(0, n - 1) + e.target.value.substring(n, e.target.value.length)
    } else {
        return e.target.value
    }
}


/**
 * 返回纯数字 通过正则金额
 * @param {Number, Number}
 * e 传来的数字
 * n 最长几位
 */
export function resAmount(e, n) {
    e.target.value = (e.target.value.match(/^[0-9|\.]*/g)[0]) || null
    if (e.target.value.length > n) {
        return e.target.value = e.target.value.substring(0, n - 1) + e.target.value.substring(n, e.target.value.length)
    } else {
        return e.target.value
    }
}


/**
 * 返回数字，字母 通过正则金额
 * @param {Number, Number}
 * e 传来的数字
 * n 最长几位
 */
export function resZM(e, n) {
    e.target.value = (e.target.value.match(/^[A-Za-z0-9]*/g)[0]) || null
    if (e.target.value.length > n) {
        return e.target.value = e.target.value.substring(0, n - 1) + e.target.value.substring(n, e.target.value.length)
    } else {
        return e.target.value
    }
}


/**
 * 获取浏览器信息
 */
export function getExplore() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d\.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/edge\/([\d\.]+)/)) ? Sys.edge = s[1] :
                (s = ua.match(/firefox\/([\d\.]+)/)) ? Sys.firefox = s[1] :
                    (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? Sys.opera = s[1] :
                        (s = ua.match(/chrome\/([\d\.]+)/)) ? Sys.chrome = s[1] :
                            (s = ua.match(/version\/([\d\.]+).*safari/)) ? Sys.safari = s[1] : 0;
    // 根据关系进行判断
    if (Sys.ie) return ('IE: ' + Sys.ie);
    if (Sys.edge) return ('EDGE: ' + Sys.edge);
    if (Sys.firefox) return ('Firefox: ' + Sys.firefox);
    if (Sys.chrome) return ('Chrome: ' + Sys.chrome);
    if (Sys.opera) return ('Opera: ' + Sys.opera);
    if (Sys.safari) return ('Safari: ' + Sys.safari);
    return 'Unkonwn';
}


/**
 * 获取地址栏url参数
 * @param {String} name
 */
 export function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    let fUrl = window.location.href
    let s = fUrl.substr(fUrl.lastIndexOf("?") + 0)
    var r = s.substr(1).match(reg); // 匹配目标参数
    if (r != null) {
        let urlCode =  unescape(r[2])
        if(!urlCode) {
            urlCode = decodeURI(r[2])
        }
        return urlCode;
    }else{
        return null; // 返回参数值
    }
}

// 获取特定地址中的参数
export function getQueryVariable(url,name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    let fUrl = url
    let s = fUrl.substr(fUrl.lastIndexOf("?") + 0)
    var r = s.substr(1).match(reg); // 匹配目标参数
    if (r != null) {
        let urlCode =  unescape(r[2])
        if(!urlCode) {
            urlCode = decodeURI(r[2])
        }
        return urlCode;
    }else{
        return null; // 返回参数值
    }
}

//时间戳对象转换为日期格式
export const formatDate = ((value, t) => {
    let date = new Date(value);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    if (t) {
        return y + '-' + MM + '-' + d;
    } else {
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
    }
})

//去掉字符串所有的空格, 并且转换小写
export const cltrim = ((val) => {
    return val.replace(/(^\s*)/g, "").toLowerCase()
})

//60s倒计时
export const count = ((val) => {
    let hour = 60
    window.timer = setInterval(() => {
        hour--
        document.getElementById(val).innerHTML = '倒计时' + hour + ' s'
        document.getElementById(val).disabled = true
        if (hour <= 0) {
            document.getElementById(val).disabled = false
            document.getElementById(val).innerHTML = '重新获取'
            clearInterval(window.timer)
        }
    }, 1000);
})

//动态创建js
export const creatJs = ((url) => {
    let head = document.getElementsByTagName("head")[0];
    let script = document.createElement("script");
    script.src = url;
    head.appendChild(script);
})

//跳转路由
export const link = ((url, param, inx) => {
    if (url) {
        router.push({path: url, query: {type: param, index: inx}})
    } else {
        window.location.href = url
    }
})
//8,公共图片方法
export const bgImg = ((url) => {
    return `background-image:url(${url})`;
})

// 预加载图片
export async function loadImage(src) {
    let p = new Promise(function (resolve, reject) {
        let img = new Image();
        //img.setAttribute("class",'tempimg');
        //img.setAttribute('crossOrigin', 'anonymous');
        img.onload = function () {//加载时执行resolve函数
            resolve(img);
        }
        img.onerror = function () {
            reject(src);
        }
        img.src = src;
    })
    return p;
}

// webp格式转换为png格式
export function convertWebp(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);//0, 0参数画布上的坐标点，图片将会拷贝到这个地方
    let src = canvas.toDataURL("image/png");
    return src;
}

//加载并转换图片
export function getPngImage(src) {
    //获取最后一个.的位置
    let index = src.lastIndexOf(".");
    //获取后缀
    let ext = src.substr(index + 1);
    //不支持webp && 图片格式为webp
    if (!window.isSupportWebp && ext === 'webp') {
        return new Promise(function (resolve, reject) {
            let img = new Image();
            //img.setAttribute('crossOrigin', 'anonymous');
            img.onload = function () {//加载时执行resolve函数
                let canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext("2d").drawImage(img, 0, 0);//0, 0参数画布上的坐标点，图片将会拷贝到这个地方
                let png = canvas.toDataURL("image/png");
                resolve(png);
            }
            img.onerror = function () {
                reject(src);
            }
            img.src = src;
        })
    } else {
        return Promise.resolve(src);
    }
}

//TODO 获取图片列表 封装数据列表 要确定转换的是哪个字段;
export function getImageList(list, obj) {
    var proList = [];
    list.forEach(item => {
        proList.push(loadImage(item));
    })
    Promise.all(proList).then((result) => {
        // console.log(result)
    }).catch((error) => {
        // console.log(error)
    })
}


/**
 * 转换webp格式图片后缀为png
 * @param url
 * @returns {string|*}
 */
export function imgFormat(url) {
    if (!url) return '';
    // 如果浏览器不支持webp格式的图片
    if (window.isSupportWebp) {
        return url;
    } else {
        // 图片名称
        //let imgName = url.replace(/(.*\/)*([^.]+).*/ig, "$2");
        // 图片后缀
        let suffix = url.substring(url.lastIndexOf('.') + 1);
        // 判断图片后缀是否是webp
        if (suffix == 'webp') {
            return url.replace('.webp', '.png');
        } else {
            return url;
        }
    }
}

// 更换主题
export function chengTheme(theme) {
    window.document.documentElement.setAttribute('data-theme', theme);
}

// 保留两位小数
export function toFixedFun(value) {
    if (value == '' || value == undefined || value == Number.MAX_VALUE) {
        value = "0";
    }
    if (isNaN(value)) {
        return "0";
    }
    if (typeof value !== "number") {
        return value;
    }
    let num = 0;
    // 判断最后两位小数是不是大于零
    let decimal = Number(value) - Math.trunc(Number(value))
    if (decimal === 0) {
        num = (Math.floor(Number(value) * 100) / 100).toFixed(0);
    } else {
        num = (Math.floor(Number(value) * 100) / 100).toFixed(2);
    }
    return num;
}

// 取数字的小数部分
export function fract(num) {
    return num - Math.trunc(num);
}

// 创建UUID
export function createUUid() {
    // [5-9][1-3][o|m][s|o|0]
    let str1 = '56789',
        str2 = '123',
        str3 = 'om',
        str4 = 's0o'
    let i1 = parseInt(Math.random() * (str1.length - 0)) + 0,
        i2 = parseInt(Math.random() * (str2.length - 0)) + 0,
        i3 = parseInt(Math.random() * (str3.length - 0)) + 0
    return `xxxxxxxx${str1[i1]}xxxx${str2[i2]}xxxx${str3[i3]}yxxx${str4}xxxxxxxxxxxx`.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


// 返回OSS资源地址
export function ossImg(url) {
    // let u = url,
    //     res = store.state.aliOssObj
    // if(res.type == 1 || (url && url.length>500)) {
    //    u = url
    // }
    // if(res.type == 2 && (url && url.length<500)) {
    //     u = res.domain + '/' + url
    // }
    return url
}


/** 随机生成固定位数或者一定范围内的字符串数字组合
 * @param {Number} min 范围最小值
 * @param {Number} max 范围最大值，当不传递时表示生成指定位数的组合
 * @returns {String} 返回字符串结果
 * */
export function randomRange(min, max){
    var returnStr = "",
        range = (max ? Math.round(Math.random() * (max-min)) + min : min),
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    for(var i=0; i<range; i++){
        var index = Math.round(Math.random() * (arr.length-1));
        returnStr += arr[index];
    }
    return returnStr;
}
// 随机生成数字
export function randomCoding(max){
    let number= "";
    let  n = 4;//这个值可以改变的，对应的生成多少个数字，根据自己需求所改
    if(max && max >0){
        n = max;
    }
    for(var i=0;i<n;i++){
        number+= Math.floor(Math.random() * 10);
    }
    return number;
}

// 判断是不是对象
export function isObject(object){
    if (Object.keys(object).length === 0) {
        return false // 如果为空,返回false
    }
    return true // 如果不为空，则会执行到这一步，返回true
}

// 获取样式
export function getElementStyles(maniAttribute) {
    const styleElement = document.querySelector(':root');
    const cssStyles = getComputedStyle(styleElement);
    const cssVal = String(cssStyles.getPropertyValue(maniAttribute)).trim();
    return cssVal;
}

// 设置样式
export function setElementStyle(name,value){
    const styleElement = document.querySelector(':root');
    styleElement.style.setProperty(name, value);
}

// fingerprint
export function getFingerprintFun(){
    // Create a new ClientJS object
    const client = new ClientJS();
    // Get the client's fingerprint id
    const fingerprint = client.getFingerprint();
    // Print the 32bit hash id to the console
    //console.log(fingerprint);
    return fingerprint.toString();
}

// 设置数据埋点 activated() {this.$setBuriedPoint("pc_beauty")}
export function setBuriedPointFun(code){
    store.dispatch("setBuriedPointAction",{code:code,deviceKey:getFingerprintFun(),templateId:store.state.templateStore.templateId});
}

// 获取平台类型
export function getPlatForm(){
    let platform = 'PC'
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        platform = "IOS"
    } else if (/(Android)/i.test(navigator.userAgent)) {
        console.log('这是Android');
        platform = "Android"
    }
    return platform
}

// 获取浏览器类型和版本
export function getBrowser() {
    var UserAgent = navigator.userAgent.toLowerCase();
    var browserInfo = {};
    var browserArray = {
        IE: window.ActiveXObject || "ActiveXObject" in window, // IE
        Chrome: UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1, // Chrome浏览器
        Firefox: UserAgent.indexOf('firefox') > -1, // 火狐浏览器
        Opera: UserAgent.indexOf('opera') > -1, // Opera浏览器
        Safari: UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') == -1, // safari浏览器
        Edge: UserAgent.indexOf('edge') > -1, // Edge浏览器
        QQBrowser: /qqbrowser/.test(UserAgent), // qq浏览器
        WeixinBrowser: /MicroMessenger/i.test(UserAgent) // 微信浏览器
    };
    // console.log(browserArray)
    for (var i in browserArray) {
        if (browserArray[i]) {
            var versions = '';
            if (i == 'IE') {
                versions = UserAgent.match(/(msie\s|trident.*rv:)([\w.]+)/)[2];
            } else if (i == 'Chrome') {
                for (var mt in navigator.mimeTypes) {
                    //检测是否是360浏览器(测试只有pc端的360才起作用)
                    if (navigator.mimeTypes[mt]['type'] == 'application/360softmgrplugin') {
                        i = '360';
                    }
                }
                versions = UserAgent.match(/chrome\/([\d.]+)/)[1];
            } else if (i == 'Firefox') {
                versions = UserAgent.match(/firefox\/([\d.]+)/)[1];
            } else if (i == 'Opera') {
                versions = UserAgent.match(/opera\/([\d.]+)/)[1];
            } else if (i == 'Safari') {
                versions = UserAgent.match(/version\/([\d.]+)/)[1];
            } else if (i == 'Edge') {
                versions = UserAgent.match(/edge\/([\d.]+)/)[1];
            } else if (i == 'QQBrowser') {
                versions = UserAgent.match(/qqbrowser\/([\d.]+)/)[1];
            }
            browserInfo.type = i;
            browserInfo.versions = parseInt(versions);
        }
    }
    return browserInfo;
}
