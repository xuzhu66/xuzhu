// 1-100之间所有的合，平均值

// var j = 0;
// for (var i = 1; i <= 100; i++) {
//     j += i;
// }
// console.log(j);
// console.log(j / 100);

// //1-100之间所有的偶数合
// var j = 0;
// for (var i = 1; i <= 100; i++) {
//     if (i % 2 == 0) {
//         j += i;
//     }
// }
// console.log(j);

// //100内7的倍数的合
// var j = 0;
// for (var i = 1; i <= 100; i++) {
//     if (i % 7 == 0) {
//         j += i;
//     }
// }
// console.log(j);

// //打印矩形，每次输出一个🌟
// var pdd = '';
// for (var i = 1; i <= 4; i++) {
//     for (var j = 1; j <= 5; j++) {
//         pdd += '🌟';
//     }
//     pdd += '\n'
// }
// console.log(pdd);

// //打印三角形
// var pdd = '';
// for (var i = 1; i <= 5; i++) {
//     for (var j = 1; j <= i; j++) {
//         pdd += '🌟';
//     }
//     pdd += '\n'
// }
// console.log(pdd);

// //for99乘法表
// var asd = '';
// for (var i = 1; i <= 9; i++) {
//     for (var j = 1; j <= i; j++) {
//         asd += j + 'x' + i + '=' + j * i + '\t';
//     }
//     asd += '\n';
// }
// console.log(asd);

// 接受用户账号密码，若账号“admin”，密码“123456”，成功，否则一直输入。
// do {
//     var i = prompt('输入账号:')
// } while (i !== 'admin');
// do {
//     var j = prompt('输入密码:')
// } while (j !== '123456');
// alert('登陆成功');

// 1-100累加跳过个位数为3的数，合
// var pdd = 0;
// for (var i = 1; i <= 100; i++) {
//     if (i % 10 != 3) {
//         pdd += i
//     }
// }
// console.log(pdd);

// // var pdd = 0;
// for (var i = 1; i <= 100; i++) {
//     if (i % 10 == 3) {
//         continue;
//     } else if (i % 10 != 3) {
//         pdd += i
//     }
// }
// console.log(pdd);

// 取1-100内个位数是3的数字，取和
// let count = 0;
// let i = 0;
// while (i < 100) {
//     i++
//     if (i % 10 == 3) {
//         console.log(i);
//         count += i;
//         continue
//     }
// }
// console.log(count);

// //ATM机
// var j = 100;
// for (var k = 0; k <= 3; k) {
//     var i = prompt('请输入你要的操作:' + '\n' + '1.存钱' + '\n' + '2.取钱' + '\n' + '3.显示余额' + '\n' + '4.退出')
//     switch (i) {
//         case '1':
//             var a = prompt('请你输入你要存的钱数:')
//             j += parseInt(a);
//             alert('你现在的余额是:' + parseInt(j))
//             break;
//         case '2':
//             var b = prompt('请你输入你要取的钱数:')
//             j -= b;
//             alert('你现在的余额是:' + j)
//             break;
//         case '3':
//             alert('你现在的余额是:' + j)
//             break;
//         case '4':
//             alert('你正在退出!')
//                 // k += i;
//             k = k + i;
//             break;

//         default:
//             break;
//     }
// }

// //ATM增加取款条件
// var j = 100;
// for (var k = 1; k <= 4; k) {
//     var i = prompt('请输入你要的操作:' + '\n' + '1.存钱' + '\n' + '2.取钱' + '\n' + '3.显示余额' + '\n' + '4.退出')
//     switch (i) {
//         case '1':
//             var a = prompt('请你输入你要存的钱数:')
//             j += parseInt(a);
//             alert('你现在的余额是:' + parseInt(j))
//             break;
//         case '2':
//             var b = prompt('请你输入你要取的钱数:')
//             if (j > b) {
//                 j -= b;
//                 alert('你现在的余额是:' + j)
//             } else if (b > j) {
//                 alert('你现在的余额不足')
//             }
//             break;
//         case '3':
//             alert('你现在的余额是:' + j)
//             break;
//         case '4':
//             alert('你正在退出!')
//                 // k += i;
//             k = k + i;
//             break;
//         default:
//             alert('不正确')
//             break;
//     }
// }

// var asd = ['星期一', ' 星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
// console.log(asd[6]);

// var asd = [2, 6, 1, 7, 4, 10]
// var j = 0;
// for (var i = 0; i < asd.length; i++) {
//     j += asd[i];
// }
// console.log(parseFloat(j));
// console.log(parseFloat(j / asd.length));

// 取数组里的最大值
// var asd = [2, 6, 1, 77, 52, 25, 7];
// var max = asd[0];
// for (var i = 1; i < asd.length; i++) {
//     if (asd[i] > max) {
//         max = asd[i]
//     }
// }
// console.log(max);

// 数组转换字符串输出
// var arr = ['red', 'green', 'blue', 'pink'];
// var asd = '';
// for (var i = 0; i < arr.length; i++) {
//     asd += arr[i] + '|';
// }
// console.log(asd);
// console.log(i);

// 放入数组1-10
// var asd = [];
// var pdd = 0;
// for (var i = 0; i <= 9; i++) {
//     pdd++;
//     asd[i] = pdd;
// }
// console.log(asd);

// 数组中大于等于10的放入另外一个数组（新数组带空值）
// var asd = [2, 0, 6, 1, 77, 0, 52, 0, 25, 7];
// var pdd = [];
// var j = 0;
// for (var i = 0; i < asd.length; i++) {
//     if (asd[i] >= 10) {
//         pdd[j] = asd[i];
//         j++;
//     }
// }
// console.log(pdd);
// console.log(asd);

// 数组中大于等于10的放入另外一个数组（新数组不带空值）
// let asd = [1, 12];
// let pdd = [];
// for (let i = 0; i < asd.length; i++) {
//     if (asd[i] >= 10) {
//         pdd.push(asd[i])
//     }

// }
// console.log(pdd);
// console.log(asd);

// 去除数组中的0
//  var asd = [2, 0, 6, 1, 77, 0, 52, 0, 25, 7]
//  var pdd = [];
//  for (var i = 0; i < asd.length; i++) {
//      if (asd[i] != 0) {
//          pdd[pdd.length] = asd[i]
//      }
//  }
//  console.log(pdd);

// 数组倒叙排序
// var asd = ['red', 'green', 'blue', 'pink', 'purple', 'sfdsfs'];
// for (var i = asd.length - 1; i >= 0; i--) {
//     console.log(asd[i]);
// }

// 输入两个数字，使用随意加减乘除法计算
// function pdd(num1, num2) {
//     var i = num1;
//     var j = num2;
//     var p = i + j;
//     return p;
// }
// var zxc = prompt('1:');
// var vbn = prompt('2:')
// var asd = pdd(parseFloat(zxc), parseFloat(vbn));
// alert('' + asd)

// 函数，取数组最大值
// function pdd(arr) {
//     var max = arr[0];
//     for (var i = 0; i <= arr.length; i++) {
//         if (arr[i] > max) {
//             max = arr[i]
//         }
//     }
//     return max;
// }
// var re = pdd([5, 2, 99, 101, 67, 77]);
// console.log(re);

// 函数冒泡排序
// function xuzhu(arr) {
//     for (var i = 0; i <= arr.length - 1; i++) {
//         for (var j = 0; j <= arr.length - i - 1; j++) {
//             if (arr[j] > arr[j + 1]) {
//                 var temp = arr[j];
//                 arr[j] = arr[j + 1];
//                 arr[j + 1] = temp;
//             }
//         }
//     }
//     return arr;
// }
// var arr1 = xuzhu([1, 6, 2, 4, 56, 768, 3, 23, 12]);
// console.log(arr1);
// var arr2 = xuzhu([2, 234, 324, 3, 56, 768, 3, 23, 12]);
// console.log(arr2);

// 创建对象方法1
// var asd = {
//     uname: '可可',
//     type: '阿拉斯加犬',
//     age: 5,
//     color: '棕红色',
//     sao: function() {
//         console.log('bark', 'showFilm');

//     }
// }
// console.log(asd.uname);
// console.log(asd['color']);
// asd.sao();

// 创建对象方法2 （Object）
// var asd = new Object();
// asd.uname = '鸣人';
// asd.sex = '男';
// asd.age = 19;
// asd.pdd = function() {
//     console.log('影分身术');
// }
// console.log(asd.uname);
// console.log(asd['sex']);
// asd.pdd();

// 构造函数
// function Wzry(uname, type, blood) {
//     this.uname = uname;
//     this.type = type;
//     this.blood = blood;
//     this.attackp = function(attack) {
//         console.log(attack);
//     }
// }
// var wzryz = new Wzry('lp', 'll', '500');
// console.log(wzryz.uname);
// wzryz.attackp('近战');

// 构造函数+输入框
// function Wzry(uname, type, blood) {
//     this.uname = uname;
//     this.type = type;
//     this.blood = blood;
//     this.ff = function(attack) {
//         console.log(attack);
//     }
// }
// let e = prompt('1');
// let o = prompt('2');
// let u = prompt('3');
// let y = prompt('4');

// var i = new Wzry(e, o, u)
// console.log(i.uname);
// console.log(i.type);
// console.log(i.blood);
// i.ff(y);

// 创建一个电脑对象
// function Diannao(color, zl, pp, xh) {
//     this.color = color;
//     this.zl = zl;
//     this.pp = pp;
//     this.xh = xh;
//     this.zy = function(gn) {
//         console.log(gn);
//     }
// }
// let e = prompt('1');
// let o = prompt('2');
// let u = prompt('3');
// let y = prompt('4');
// let b = prompt('5');
// var asd = new Diannao(e, o, u, y);
// // console.log(asd.color);
// // console.log(asd.zl);
// // console.log(asd.pp);
// // console.log(asd.xh);
// for (var k in asd) {
//     console.log(asd[k]);
// }
// asd.zy(b);

// 创建一个按钮
// function An(k, g, bj) {
//     this.k = k;
//     this.g = g;
//     this.bj = bj;
//     this.dj = function(xc) {
//         console.log(xc);
//     }
// }
// var jkl = new An(231, 212, 121)
// console.log(jkl.k);
// console.log(jkl.g);
// console.log(jkl.bj);
// jkl.dj('打开网站啊🤔');

// 任意数组的排序
// function Shuzu(test1, test2, test3, test4) {
//     this.test1 = test1;
//     this.test2 = test2;
//     this.test3 = test3;
//     this.test4 = test4;
// }
// let a = prompt('1');
// let b = prompt('2');
// let c = prompt('3');
// let d = prompt('4');
// var jkl = new Shuzu(a, b, c, d)
// var p = 0;
// for (var i = 1; i <= Object.keys(jkl).length; i++) {
//     for (var j = 1; j <= Object.keys(jkl).length; j++) {
//         if (jkl["test" + i] > jkl["test" + j]) {
//             p = jkl["test" + i];
//             jkl["test" + i] = jkl["test" + j];
//             jkl["test" + j] = p;
//         }
//     }
// }
// console.log(jkl);

// 字母量创建对象
// var sx = {
//     uname: '可可',
//     type: '阿拉斯加',
//     age: 5,
//     color: '棕红色',
//     jn: function() {
//         var bark = '汪汪'
//         var showFilm = '电影'
//         console.log(bark);
//         console.log(showFilm);
//     }

// }

// console.log(sx.uname);
// console.log(sx['age']);
// sx.jn();

// //new Object方式创建对象
// var obj = new Object();
// obj.uname = '鸣人';
// obj.sex = '男';
// obj.age = 19;
// obj.skull = function() {
//     var yfss = '影分身术';
//     console.log(yfss);
// }
// console.log(obj.uname);
// console.log(obj.sex);
// console.log(obj['age']);
// obj.skull();

// 构造函数创建对象
// function Wzry(uname, type, blood) {
//     this.uname = uname;
//     this.type = type;
//     this.blood = blood;
//     this.attack = function(gj) {
//         console.log(gj);
//     }
// }
// var lp = new Wzry('廉颇', '力量型', 500)
// console.log(lp);
// console.log(lp.uname);
// console.log(lp['blood']);
// lp.attack('近战');
// var hy = new Wzry('后裔', '射手型', 100)
// console.log(hy.uname);
// console.log(hy['blood']);
// hy.attack('远程');



// 计算器
// for (var i = 1; i < 5; i) {
//     var xz = prompt('1.加法运算' + '\n' + '2.减法运算' + '\n' + '3.乘法运算' + '\n' + '4.除法运算' + '\n' + '5.退出' + '\n' + '请输入你的选项:')
//     if (xz < 5 && xz > 0) {
//         var xz1 = prompt('输入一个数字:');
//         var xz2 = prompt('输入二数字:')

//     } else if (xz > 5 || xz < 0) {
//         alert('请输入符合的数字。');
//     } else if (xz == 5) {
//         alert('退出计算器。');
//         break;
//     }

//     function Jsq(jia, jian, cheng, chu) {
//         this.jiafa = jia;
//         this.jianfa = jian;
//         this.chengfa = cheng;
//         this.chufa = chu;
//         this.tc = function() {

//             if (xz == 1) {
//                 alert(shuzi.jiafa)
//                     // console.log(shuzi.jiafa);
//             } else if (xz == 2) {
//                 alert(shuzi.jianfa)
//                     // console.log(shuzi.jianfa);
//             } else if (xz == 3) {
//                 alert(shuzi.chengfa)
//                     // console.log(shuzi.chengfa);
//             } else if (xz == 4) {
//                 alert(shuzi.chufa)
//                     // console.log(shuzi.chufa);
//             }
//         }
//     }
//     var shuzi = new Jsq((parseInt(xz1) + parseInt(xz2)), (xz1 - xz2), (xz1 * xz2), (xz1 / xz2));
//     shuzi.tc();
// }