// var age = prompt('请输入你的年龄:');
// var xianzhi = 18;
// if (age >= 50) {
//     alert('找孩子的')
// } else if (age >= xianzhi && age >= 30 && age >= 20 && age <= 25) {
//     alert('可以进入网吧😄' + '\n' + '可以抽烟' + '\n' + '上网半价')
// } else if (age >= xianzhi && age < 30 && age >= 20 && age <= 25) {
//     alert('可以进入网吧😄' + '\n' + '不可以抽烟' + '\n' + '上网半价')
// } else if (age >= xianzhi && age < 30 && age < 20 && age > 25) {
//     alert('可以进入网吧😄' + '\n' + '不可以抽烟' + '\n' + '没半价优惠')
// } else if (age >= xianzhi && age >= 30 && age < 20 && age > 25) {
//     alert('可以进入网吧😄' + '\n' + '可以抽烟' + '\n' + '没半价优惠')
// } else if (age >= xianzhi && age < 30) {
//     alert('可以上网' + '\n' + '不能抽烟')
// } else {
//     alert('不能上网' + '\n' + '不能抽烟')
// }


// var nfg = prompt('请输入要检测的年份:')
// if (nfg % 400 == 0) {
//     alert('当前是闰年')
// } else {
//     alert('当前是平年')
// }

// var myname = prompt('你的姓名是:');
// var ldh = '刘德华';
// if (myname === ldh) {
//     alert('中奖5元')
// } else {
//     alert('没中奖')
// }

// var fenshu = prompt('输入你的分数:');
// if (fenshu >= 90) {
//     alert('A')
// } else if (fenshu >= 80) {
//     alert('B')
// } else if (fenshu >= 70) {
//     alert('C')
// } else if (fenshu >= 60) {
//     alert('D')
// } else {
//     alert('E')
// }


// var time = prompt('输入数字:');
// var result = time < 10 ? '0' + time : time;
// alert(result);


// var sg = prompt('水果名:');
// switch (sg) {
//     case '榴莲':
//         alert('1000')
//         break;
//     case '香蕉':
//         alert('100')
//         break;
//     case '苹果':
//         alert('10')
//         break;
//     default:
//         alert('没有这种水果')
//         break;
// }

// var sj = prompt('输入时间:');
// if (sj <= 12) {
//     alert('中午好!')
// } else if (sj <= 18) {
//     alert('晚上好!')
// } else if (sj <= 23) {
//     alert('深夜好!')
// } else {
//     alert('不睡觉')
// }

// var sz1 = prompt('输入数字1:');
// var sz2 = prompt('输入数字2:');
// if (sz1 > sz2) {
//     alert(sz1)
// } else if (sz1 < sz2) {
//     alert(sz2)
// } else {
//     alert('一样大')
// }


// var sz = prompt('输入数字:');
// if (sz % 2 == 1) {
//     alert('奇数')
// } else {
//     alert('偶数')
// }

// var xqj = prompt('今天是星期几:');
// switch (xqj) {
//     case '1':
//         alert('今天星期一')
//         break;
//     case '2':
//         alert('今天星期二')
//         break;
//     case '3':
//         alert('今天星期三')
//         break;
//     case '4':
//         alert('今天星期四')
//         break;
//     case '5':
//         alert('今天星期五')
//         break;
//     case '6':
//         alert('今天星期六')
//         break;
//     case '7':
//         alert('今天星期日')
//         break;
//     default:
//         alert('日子过混头了吧');
// }


// var sum = 0;
// for (var i = 1; i <= 100; i++) {
//     sum += i;
// }
// console.log(sum);


// var sum = 0;
// var asd = 0;
// for (var i = 1; i <= 100; i++) {
//     if (i % 2 == 0) {
//         sum += i;
//     } else {
//         asd += i;
//     }
// }
// console.log(sum);
// console.log(asd);



// var sum = 0;
// for (var i = 1; i <= 10; i++) {
//     sum += i;
//     asd = sum / i;
// }
// console.log(asd);

// var asd = 0;
// for (var i = 1; i <= 100; i++) {
//     if (i % 3 == 0) {
//         asd += i;
//     }
// }
// console.log(asd);

// var cj = 0; //成绩合
// var pod = 0; //平均分
// var asd = prompt('输入班级人数:') //人数
// for (var i = 1; i <= asd; i++) {
//     var he = prompt('第' + i + '个学生的成绩是:')
//     cj = cj + parseFloat(he);

// }
// pod = cj / parseFloat(asd);
// alert('平均分:' + pod + '\n' + '总分:' + cj);

// var asd = '';
// for (var i = 1; i <= 10; i++) {
//     for (var j = i; j <= 10; j++) {
//         asd += '🍌';
//     }
//     asd += '\n';
// }
// console.log(asd);

// var asd = '';
// for (var i = 1; i <= 10; i++) {
//     asd += '🍎';
//     console.log(asd);
// }

// var pod = '';
// for (var i = 1; i <= 9; i++) {
//     for (var j = 1; j <= i; j++) {
//         pod += j + 'x' + i + '=' + i * j + '\t';
//     }
//     pod += '\n';
// }
// console.log(pod);


// var pdd = '猪';
// var asd = prompt('你是猪吗？')
// while (asd !== pdd) {
//     asd = prompt('你是猪吗？')
// }
// alert('猪脑壳')


// var i = 1;
// var j = 0;
// do {
//     j += i;
//     i++;
// } while (i <= 100);
// console.log(j);


// var i = 1;
// do {
//     console.log('今年' + i + '岁');
//     i++;
// } while (i <= 100);

// var k = '猪';
// do {
//     var i = prompt('你是猪吗？')
// } while (i !== k)


// var asd = 0;
// for (var i = 1; i <= 100; i++) {
//     if (i % 7 == 0) {
//         continue;
//     }
//     asd += i;
// }
// console.log(asd);