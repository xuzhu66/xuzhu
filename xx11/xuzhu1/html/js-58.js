// 得到一个两数之间的随机数这个例子返回了一个在指定值之间的随机数。这个值不小于 min（有可能等于），并且小于（不等于）max。
// function getRandomArbitrary(min, max) {
//     return Math.random() * (max - min) + min;
// }
// console.log(Math.random(0, 10));
// ---------------------------------------------------------------
// 大于等于0，小于1之间的随机数
// function getRandom() {
//     return Math.random();
// }
// console.log(Math.random(0, 10));
// ---------------------------------------------------------------
// 指定值之间的随机整数。这个值不小于 min （如果 min 不是整数，则不小于 min 的向上取整数），且小于（不等于）max。
// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min; //不含最大值，含最小值
// }
// var pdd = getRandomInt(1, 100);
// alert(pdd);
// ---------------------------------------------------------------
// 随机数字猜猜看游戏
// function getRandomIntInclusive(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
// }
// var asd = getRandomIntInclusive(50, 1);
// alert(asd);
// for (var i = 1; i <= 4; i++) {
//     if (i <= 3) {
//         var ppt = prompt('输入数字:')
//         if (ppt > asd) {
//             alert('大了,继续');
//         } else if (ppt < asd) {
//             alert('小了,继续');
//         } else if (ppt = asd) {
//             alert('OK,结束');
//             break;
//         }
//     } else {
//         alert('没次数了,结束');
//     }
// }
// ---------------------------------------------------------------
// 无值，输出系统时间
// var date = new Date();
// console.log(date);
// ---------------------------------------------------------------
// 有值
// var date1 = new Date('2022-3-30 15:38:21');
// console.log(date1);
// ---------------------------------------------------------------
// 格式化年月日
// var pdd = new Date();
// console.log(pdd.getFullYear()); //年
// console.log(pdd.getMonth() + 1); //月
// console.log(pdd.getDate()); //日
// console.log(pdd.getDay()); //周几
// console.log(pdd.getHours()); //时
// console.log(pdd.getMinutes()); //分
// console.log(pdd.getSeconds()); //秒
// ---------------------------------------------------------------
// 写个2022年3月30号星期三
// var date = new Date();
// var year = date.getFullYear();
// var Month = date.getMonth() + 1;
// var datea = date.getDate();
// var xqj = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
// var Day = date.getDay();
// console.log('今天是:' + year + '年' + Month + '月' + datea + '日' + xqj[Day]);
// ---------------------------------------------------------------
// //格式化 时分秒
// var pdd = new Date();
// var qwe = pdd.getHours(); //时
// qwe = qwe < 10 ? '0' + qwe : qwe;
// var sdf = pdd.getMinutes(); //分
// sdf = sdf < 10 ? '0' + sdf : sdf;
// var zxc = pdd.getSeconds(); //秒
// zxc = zxc < 10 ? '0' + zxc : zxc;
// //封装函数返回时分秒
// function Sfm(shi, fen, miao) {
//     this.shi = shi;
//     this.fen = fen;
//     this.miao = miao;
// }
// var asd = new Sfm(qwe, sdf, zxc)
// console.log('现在是:' + asd.shi + ':' + asd.fen + ':' + asd.miao);
// ---------------------------------------------------------------
//时间戳
// console.log(Date.now());
// ---------------------------------------------------------------
//倒计时
// function a(timi) {
//     var b = +new Date; //现在时间
//     var c = new Date(timi) //输入时间
//     var d = (c - b) / 1000 //剩下的秒数
//     var u = parseInt(d / 60 / 60 / 24); //天
//     var u = u < 10 ? '0' + u : u;
//     var h = parseInt(d / 60 / 60 % 24); //时
//     var h = h < 10 ? '0' + h : h;
//     var m = parseInt(d / 60 % 60); //分
//     var m = m < 10 ? '0' + m : m;
//     var s = parseInt(d % 60); //秒
//     var s = s < 10 ? '0' + s : s;
//     return u + '天' + h + '时' + m + '分' + s + '秒';
// }
// console.log(a('2022-3-31 20:05:12'));
// ---------------------------------------------------------------
//数组去重
// function asd(poi) {
//     var kl = [];
//     for (var i = 0; i < poi.length; i++) {
//         if (kl.indexOf(poi[i]) === -1) {
//             kl.unshift(poi[i])
//         }
//     }
//     return kl;
// }
// var demo = asd([1, 2, 3, 1])
// console.log(demo);
// ---------------------------------------------------------------
//提取相同数字在字符串中的所在位置
// function wz(ppd) {
//     var weizhi = [];
//     for (var i = 0; i < ppd.length; i++) {
//         if (ppd[i] == 'o') {
//             weizhi.push(i);
//         }
//     }
//     return weizhi;
// }
// var dame = wz('abcoefoxyozzopp')
// console.log(dame);
// //提取相同数字在字符串中的共多少个
// function wz(ppd) {
//     var weizhi = [];
//     var jici = 0;
//     for (var i = 0; i < ppd.length; i++) {
//         if (ppd[i] == 'o') {
//             weizhi.push(ppd[i]);
//             jici = weizhi.length + 0;
//         }
//     }
//     return jici;
// }
// var dame = wz('abcoefoxyozzopp')
// console.log(dame);
//提取相同数字在数组中的所在位置
// function wz(ppd) {
//     var weizhi = [];
//     for (var i = 0; i < ppd.length; i++) {
//         if (ppd[i] == 'red') {
//             weizhi.push(i);
//         }
//     }
//     return weizhi;
// }
// var dame = wz(['red', 'blue', 'red', 'gerrn', 'pink', 'red', 'red'])
// console.log(dame);
//统计字符串中的每个字符出现的次数
// var dame = 'abcoefoxyozzopp';
// var a = {};
// for (var i = 0; i < dame.length; i++) {
//     var abcd = dame.charAt(i); //abcd得到字符串的每一个字符
//     if (a[abcd]) { //a[abcd]得到的是属性值
//         a[abcd]++;
//     } else {
//         a[abcd] = 1;
//     }
// }
// console.log(a);
// var max = 0;
// //遍历对象
// var ch = '';
// for (var k in a) {
//     if (a[k] > max) {
//         //输出a得到的是属性名
//         //a[k]得到的是属性值
//         max = a[k];
//         ch = k;
//     }
// }
// console.log(max);
// console.log(ch);
// ---------------------------------------------------------------