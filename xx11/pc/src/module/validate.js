import _ from 'lodash';
import Big from 'big.js/big.mjs';

export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
}

// 验证代理商老板、员工、运营、超管用户名
export function validateUserName(str) {
    // 首位字母 数字和字母 4-8位
    const reg = /^[a-z][a-z|\d]{3,7}$/;
    return reg.test(str);
}

// 验证一般用户名
export function validateCommonUserName(str) {
    // 中英文、数字、字母 2-20位
    const reg = /^[\u4E00-\u9FA5_A-Za-z0-9]{2,20}$/;
    return reg.test(str);
}

// 验证1-20位字符串
export function yizhiershizifu(str) {
    // 中英文、数字、字母 1-20位
    const reg = /^[\u4E00-\u9FA5_A-Za-z0-9]{1,20}$/;
    return reg.test(str);
}

// 验证2-15位字符
export function validOneToFiveth(str) {
    const reg = /[\u4E00-\u9FA5_A-Za-z0-9]{2,15}$/;
    return reg.test(str);
}

// 验证2-15位数字
export function validFigure(str) {
    const reg = /^\d{2,15}$/;
    return reg.test(str);
}

// 验证1-30位字符 (字母、数字、汉字)
export function validOneToThirty(str) {
    const reg = /[\u4E00-\u9FA5_A-Za-z0-9]{1,30}$/;
    return reg.test(str);
}

// 验证1-50位字符 (字母、英文冒号)
export function validLetterColon(str) {
    const reg = /[A-Za-z:]{1,50}$/;
    return reg.test(str);
}

/* 数据供应商名称验证 */
export function dataProviderValidatName(str) {
    // 中文英文，数字，15个字符
    const reg = /^[\u4E00-\u9FA5_A-Za-z0-9]{2,20}$/;
    return reg.test(str);
}

/* 页面地址验证 */
export function pageUrl(str) {
    const reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
    return reg.test(str);
}

// 验证数IP地址
export function validIpNumber(str) {
    const reg = /[\d|.]{1,15}/;
    return reg.test(str);
}


// 验证权限名称
export function permissionName(str) {
    const reg = /^[\u4E00-\u9FA5_A-Za-z0-9]{2,25}$/;
    return reg.test(str);
}

// 验证期号
export function validOpenDate(str) {
    const reg = /^[0-9]{2,15}$/;
    return reg.test(str);
}

// 验证排序
export function validSort(str) {
    const reg = /^[0-9]{1,7}$/;
    return reg.test(str);
}

// 合法uri
export function validURL(url) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return reg.test(url);
}

// 验证邮箱
export function validEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// 七位字符、保留两位小数、只支持数字
export function validsevendata(str) {
    //  const reg = /^[1-9]$/
    const reg = /(^\d{1,4}([\.]{1}\d{1,2})?$)|(^\d{1,7}$)/;
    return reg.test(str);
}

// 九位字符、保留三位小数、只支持数字
export function validNinedata(str) {
    const reg = /(^\d{1,5}([\.]{1}\d{1,2})?$)|(^\d{1,8}$)/;
    return reg.test(str);
}

// 范围在大于或等于0小于1亿的正整数
export function validNinedatayi(str) {
    const reg = /^[0-9]{0,8}$/;
    return reg.test(str);
}

// 范围在大于或等于0且小于1亿的数字可包含3位小数
export function lingdaoyi(str) {
    const reg = /^[0-9]{0,8}[.,0-9]{0,4}$/;
    return reg.test(str);
}

// 十位字符、只支持数字 (有小数点)
export function validNinedata_wholeTen(str) {
    const reg = /\d{0,10}$/;
    return reg.test(str);
}

// 十三位字符、只支持数字 (有小数点)
export function validNinedata_wholeThirteen(str) {
    const reg = /\d{0,13}$/;
    return reg.test(str);
}

// 十位字符、保留二位小数、只支持数字
export function validNinedata_ten(str) {
    const reg = /(^\d{0,10}([\.]{1}\d{1,2})?$)|(^\d{0,10}$)/;
    return reg.test(str);
}

// 九位字符、保留二位小数、只支持数字 -1000000000到100000000.00
export function validNinedata_nineOrDecimals(str) {
    let reg = /(^[\-0-9][0-9]{0,9}([\.]{1}\d{1,2})?$)|(^[\-0-9][0-9]{0,12}$)/;

    let datastr = true;
    if (str != '') {
        datastr = reg.test(str);
    }
    let bort = true;
    if (datastr) {
        if (Number(str) > 100000000) {
            bort = false;
        }
    } else {
        bort = false;
    }
    return bort;
}

// 十三位字符、保留二位小数、只支持数字
export function validNinedata_thirteen(str) {
    const reg = /(^\d{0,10}([\.]{1}\d{1,2})?$)|(^\d{0,13}$)/;
    return reg.test(str);
}

// 十二位字符、保留二位小数、只支持数字
export function validNinedata_twelve(str) {
    const reg = /(^\d{0,9}([\.]{1}\d{1,2})?$)|(^\d{0,12}$)/;
    return reg.test(str);
    // if(str !=""){
    //     return reg.test(str)
    // }else{
    //   return true
    // }
}

// 验证注单号码长度 ---仅支持输入数字、字母(大小写)
export function validUserNameLen_zhudan_Number(str) {
    const reg = /^[0-9a-zA-Z]{0,30}$/;
    return reg.test(str);
}

// 九位字符、保留三位小数、只支持数字 -- 赔率可以为空
export function validNinedata_odds(str) {
    const reg = /(^\d{0,6}([\.]{1}\d{1,2})?$)|(^\d{0,9}$)/;
    return reg.test(str);
}

// 验证2-50位字符
export function validtwoToFifty(str) {
    const reg = /^[\u4E00-\u9FA5_A-Za-z0-9]{2,50}$/;
    return reg.test(str);
}

// 4位字符、只支持数字
export function validNinedata_wholeFour(str) {
    const reg = /^[0-9]{0,4}$/;
    return reg.test(str);
}

// 四位字符、只支持数字 0-1000
export function validNinedata_four(str) {
    const reg = /^[0-9]{0,4}$/;
    let datastr = true;
    if (str == '') {
        // 判断参数是不是为空
        datastr = false;
    } else {
        datastr = reg.test(str);
    }
    let bort = true;
    if (datastr) {
        // 不为空再进行 大于1000的判断
        if (Number(str) > 1000) {
            bort = false;
        }
    } else {
        // 为空的话，不通过
        bort = false;
    }

    return bort;
}

// 输赢金额 支持 正数，负数，正小数与负小数、数字
export function validNinedata_thirteen_negative(str) {
    const reg = /(^[\-0-9][0-9]{0,11}([\.]{1}\d{1,2})?$)|(^[\-0-9][0-9]{0,14}$)/;
    let datastr = true;
    if (str != '') {
        datastr = reg.test(str);
    }
    let bort = true;
    if (datastr) {
        if (Number(str) < -1000000000.0 || Number(str) > 1000000000.0) {
            bort = false;
        }
    } else {
        bort = false;
    }
    return bort;
}

// 七位字符、只支持数字 1-1000000
export function valid_seven_data(str) {
    const reg = /^[0-9]{1,7}$/;
    let datastr = true;
    if (str == '') {
        // 判断参数是不是为空
        datastr = false;
    } else {
        datastr = reg.test(str);
    }
    let bort = true;
    if (datastr) {
        // 不为空再进行 大于1000的判断
        if (Number(str) > 1000000) {
            bort = false;
        }
    } else {
        // 为空的话，不通过
        bort = false;
    }

    return bort;
}

// ///////////////////////////////////////////-----以下为4.0项目中写的正则-------///////////////////////////////////////////////////

// 前中后去空
export function ToEmpty(str) {
    return str.replace(/\s/g, '');
}

export function isObject(obj) {
    // 判断是否 对象
    return typeof obj === 'object' && obj.constructor === Object;
}

export function isString(obj) {
    // 判断是否 字符串
    return typeof obj === 'string' && obj.constructor === String;
}

export function isArray(obj) {
    // 判断是否是数组
    return obj && typeof obj === 'object' && obj.constructor === Array;
}

export function checkMobile(num) {
    // 判断是否是手机号
    var regIdNo = /^[1][2,3,4,5,6,7,8,9,0][0-9]{9}$/;
    if (!regIdNo.test(num)) {
        return false;
    } else {
        return true;
    }
}

export function checkCardID(num) {
    // 判断是否是身份证
    var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!regIdNo.test(num)) {
        return false;
    } else {
        return true;
    }
}

export function checkInt(num) {
    // 判断是否是整数
    if (!/^\d+$/.test(num)) {
        return false;
    } else {
        return true;
    }
}

export function checkLength(str) {
    // 字符串长度计算
    var realLength = 0;
    if (str) {
        var len = trimSpace(str).length;
        realLength = len;
    }
    return realLength;
}

export function checkNumber(num) {
    // 判断是否是数字
    // var reg = new RegExp('^-?\\d*\\.?\\d*$');
    var reg = new RegExp('^[-]?[0-9]+(\\.[0-9]+)?$');
    var regPlus = new RegExp('^[+]?[0-9]+(\\.[0-9]+)?$');
    if (regPlus.test(num) || reg.test(num)) {
        return true;
    } else {
        return false;
    }
}

export function countDecimals(value) {
    // 返回数字 有几位小数
    if (Math.floor(value) === value) return 0;
    let num = value.toString().split('.')[1];
    if (num) return num.length || 0;
    return 0;
}

export function transFloat(value) {
    return value.replace(/[^\-?\d.]/g, '');
}

export function transNumber(value, num) {
    // 四舍五入num个小数点
    let newNum = transFloat(value);
    newNum = (Math.round(newNum * 100) / 100).toFixed(num);
    return newNum;
}

export function checkDecimalPoint(num) {
    // 判断是否是num位小数，是-> 返回true
    if (/^(\-|\+)?\d+(\.\d{1,2})?$/.test(num)) {
        return true;
    } else {
        return false;
    }
}

export function checkIsValue(value) {
    // 判断是否有值
    if (value === null || value === '' || value === undefined) {
        return false;
    } else {
        return true;
    }
}

export function trimSpace(str, is_global) {
    // is_global=='g'，全局空格，不传参数去掉前后空格
    var result = '';
    if (str) {
        result = str.replace(/(^\s+)|(\s+$)/g, '');
    }
    if (is_global && str) {
        if (is_global.toLowerCase() === 'g') {
            result = result.replace(/\s/g, '');
        }
    }
    return result;
}

export function numTwoDec(value) {
    if (value === '' || value === null || value === undefined) {
        value = 0;
    }
    // 保留两位小数 四舍五入
    var num = (Math.round(value * 100) / 100).toFixed(2);
    return num;
}

export function numThou(val) {
    // 千分位格式化 保留两位小数
    if (val && val != null) {
        let isPlus = false;
        let newVal = val;
        if (typeof val == 'string') {
            if (val.includes('+')) {
                newVal = val.split('+')[1];
                isPlus = true;
            }
        }
        let bigNum = new Big(newVal);
        let bigZero = new Big('0');
        let num = bigNum.toString();
        var left = num.split('.')[0];
        var right = num.split('.')[1];
        right = right
            ? right.length >= 2
                ? '.' + right.substr(0, 2)
                : '.' + right + '0'
            : '.00';
        var temp = left
            .split('')
            .reverse()
            .join('')
            .match(/(\d{1,3})/g);
        let pre = '';
        if (bigNum.cmp(bigZero) === -1) {
            pre = '-';
        } else if (isPlus) {
            pre = '+';
        }
        return (
            pre +
            temp
                .join(',')
                .split('')
                .reverse()
                .join('') +
            right
        );
    } else if (val === 0) {
        return '0';
    } else {
        return '';
    }
}

// 六位字符、只支持数字  0-100000
export function validNinedata_six(str) {
    const reg = /^[0-9]{0,6}$/;
    let datastr = true;
    if (str != '') {
        datastr = reg.test(str);
    }
    let bort = true;
    if (datastr) {
        if (Number(str) > 100000) {
            bort = false;
        }
    } else {
        bort = false;
    }
    return bort;
}

// 7位字符、只支持数字  0-1000000
export function sevenNumber(str) {
    const reg = /^[0-9]{0,7}$/;
    let datastr = true;
    if (str != '') {
        datastr = reg.test(str);
    }
    let bort = true;
    if (datastr) {
        if (Number(str) > 1000000) {
            bort = false;
        }
    } else {
        bort = false;
    }
    return bort;
}


// 7位字符、只支持数字  1-1000000
export function sevenNumber1(str) {
    const reg = /^[1-9][0-9]{0,6}$/;
    let bol = false;
    if (reg.test(str) && str <= 1000000) {
        bol = true;
    } else {
        bol = false;
    }
    return bol;
}

// 8位字符、只支持数字  0-10000000
export function eightNumber(str) {
    const reg = /^[0-9]{0,8}$/;
    let datastr = true;
    if (str != '') {
        datastr = reg.test(str);
    }
    let bort = true;
    if (datastr) {
        if (Number(str) > 10000000) {
            bort = false;
        }
    } else {
        bort = false;
    }
    return bort;
}

// 十一位字符、保留二位小数、只支持数字  1-10000000    const reg = /(^\d{0,9}([\.]{1}\d{1,2})?$)|(^\d{0,12}$)/;
export function sevenNumber8(str) {
    // const reg = /^[1-9][0-9]{0,7}$/;
    const reg = /(^\d{0,9}([\.]{1}\d{1,2})?$)|(^\d{0,11}$)/;
    let bol = false;
    if (reg.test(str) && str <= 10000000) {
        bol = true;
    } else {
        bol = false;
    }
    return bol;
}

export function sevenNumber7(str) {
    // const reg = /^[1-9][0-9]{0,7}$/;
    const reg = /(^\d{0,8}([\.]{1}\d{1,2})?$)|(^\d{0,11}$)/;
    let bol = false;
    if (reg.test(str)) {
        bol = true;
    } else {
        bol = false;
    }
    return bol;
}

// 九位字符、只支持数字  0-100000000
export function validNinedata_nine(str) {
    let reg = /^[0-9]{0,9}$/;
    let datastr = true;
    if (str != '') {
        datastr = reg.test(str);
    }
    let bort = true;
    if (datastr) {
        if (Number(str) > 100000000) {
            bort = false;
        }
    } else {
        bort = false;
    }
    return bort;
}

// 九位字符、只支持数字  1-100000000.00
export function validNinedata_nine1(str) {
    let reg = /(^[0-9][0-9]{0,9}([\.]{1}\d{1,2})?$)|(^[0-9][0-9]{0,9}$)/;
    // const reg = /^[0-9][0-9]{0,9}$/;
    let bort = true;
    if (reg.test(str) && str <= 100000000) {
        bort = true;
    } else {
        bort = false;
    }
    // let datastr = true;
    // if (str != '') {
    //   datastr = reg.test(str);
    // }
    // let bort = true;
    // if (datastr) {
    //   if (Number(str)>0||Number(str) > 100000000) {
    //     bort = false;
    //   }
    // } else {
    //   bort = false;
    // }
    // if(Number(str)==0){
    //   bort = false;
    // }
    return bort;
}

// 判断三位字符  只限数字
export function oneToOneHundred(str) {
    let reg = /^[0-9]{1,3}$/;
    let datastr = false;
    if (str != '' && str != 0 && str < 101) {
        datastr = reg.test(str);
    }
    if ((str != '' && str == 0) || str > 100) {
        datastr = false;
    }
    return datastr;
}

// 3位字符、只支持数字  1-999
export function oneToThousand(str) {
    let reg = /^[0-9]{0,3}$/;
    let datastr = true;
    if (str != '' && str != 0) {
        datastr = reg.test(str);
    }
    if (str != '' && str == 0) {
        datastr = false;
    }
    return datastr;
}

// 3位字符、只支持数字  0-999
export function oneToNine(str) {
    let reg = /^[0-9]{1,3}$/;
    return reg.test(str);
}

// 十九位字符、只支持数字
export function validNinedata_wholenineteen(str) {
    const reg = /^[0-9]{0,19}$/;
    return reg.test(str);
}

// 银行卡号验证16-19位字符、只支持数字
export function yinHangKa(str) {
    const reg = /^[0-9]{16,19}$/;
    return reg.test(str);
}

// 验证2-15位中文字符--中文字符
export function zhongWenZiFu(str) {
    const reg = /^[\u4E00-\u9FA5]{2,15}$/;
    return reg.test(str);
}

// 会员登录密码验证--支持6-12位字符，可以是纯数字，也可以是英文，区分大小写
export function memberValidatePwd(str) {
    const reg = /^[a-zA-Z0-9]{6,12}$/;
    return reg.test(str);
}

// IP地址验证
export function ipArea(newPwd) {
    const re = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return re.test(newPwd);
}

// 验证用户账号 以小写字母开头，4-15位字母与数字组成的用户账号
export function testAccount(str) {
    const reg = /^[a-zA-Z][0-9,a-zA-Z]{3,14}$/;
    return reg.test(str);
}

// 中文，英文字母，数字字符串
export function cnEnNum(str) {
    const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
    return reg.test(str);
}

// 中文
export function cnWord(str) {
    const reg = /^[\u4E00-\u9FA5]+$/;
    return reg.test(str);
}

// 英文 数字 符号
export function enNumCharacter(string) {
    const regex = /^[0-9A-Za-z!@#$%&*()_\-+={[}\]|\:;"'<,>.?\/\\~`]/g;
    return regex.test(string);
}

// 中文 符号
export function cnCharacter(string) {
    const regex = /^[\u4e00-\u9fa5!@#$%&*()·_\-+={[}\]|\:;"'<,>.?\/\\~`]/g;
    return regex.test(string);
}

/**
 *
 * @param obj
 * @param rules
 * @returns {*}
 *
 * 参数
 required： true, 表示必输项
 tip ： 提示语句
 decimal：0表示整数，2代表保留2位以内的小数，以此类推
 strMax ：最大字符长度， strMin： 最小字符长度
 numMax： 数值最大， numMin： 最小数值
 define: 自定义校验函数
 使用如下四种写法(除了自定义校验以外：{define: this.checkCompanyId, tip: '请输入。。。'} )：
 [
 {require: true, tip: '年龄不能为空'},
 {strMax: 5, strMin: 2, tip:'长度在 2 到 5 个字符'},
 {numMax: 1000000000000, numMin: 0, tip: '请输入0到12位数值'},
 {decimal: 0, tip: '请输入整数'},
 {define: this.checkCompanyId, tip: '请输入。。。'}
 ],
 */
export function validateValue(obj, rules) {
    // 校验函数
    // 参数obj 为值
    let newObj = _.cloneDeep(obj);
    let value = _.isArray(newObj) ? newObj : _.trim(newObj);
    // rule 为数组规则
    let rule = rules;
    // 新增自定义提示语句
    if (rule && rule.length > 0) {
        for (let i = 0; i < rule.length; i++) {
            if (
                value === '' ||
                value === null ||
                value === undefined ||
                (Array.isArray(value) && value.length === 0)
            ) {
                if (rule[i].required) return rule[i].tip;
                continue;
            }
            if (rule[i].strMax || rule[i].strMin) {
                if (
                    checkLength(value) > rule[i].strMax ||
                    checkLength(value) < rule[i].strMin
                )
                    return rule[i].tip;
            }
            if (rule[i].numMax || rule[i].numMin || rule[i].decimal >= 0) {
                let decimalLen = '';
                let decimalStr = value.toString().split('.')[1];
                if (decimalStr) decimalLen = value.toString().split('.')[1].length;
                if (!checkNumber(value)) return rule[i].tip;
                if (decimalLen && decimalLen > rule[i].decimal) return rule[i].tip;
                // 数值最大值 最小值 进行比较
                let valueBig = new Big(value);
                if (rule[i].numMax) {
                    let maxBig = new Big(rule[i].numMax);
                    if (maxBig.cmp(valueBig) === -1) {
                        return rule[i].tip;
                    }
                }
                if (rule[i].numMin) {
                    let minBig = new Big(rule[i].numMin);
                    if (minBig.cmp(valueBig) === 1) {
                        return rule[i].tip;
                    }
                }
                // if (value > rule[i].numMax || value < rule[i].numMin)
                //   return rule[i].tip;
            }
            if (rule[i].define) {
                var errTip = rule[i].define(value);
                if (!errTip) {
                    return rule[i].tip;
                }
            }
        }
    }
}

export function validateObj(obj, rule) {
    // 遍历对象校验
    for (let key in obj) {
        let tip = '';
        if (rule[key]) {
            tip = validateValue(obj[key], rule[key]);
        }
        if (tip) {
            window.win.tips.success(tip);
            return false;
        }
    }
    return true;
}

// 验证不超过20位字符 中文/字母/数字组成
export function oneTotWenty(str) {
    const reg = /^[\u4E00-\u9FA5_A-Za-z0-9]{1,20}$/;
    return reg.test(str);
}

// 1-10000的整数排序
export function validSort2(str) {
    const reg = /^([1-9]\d|[1-9]\d{0,2}|1000)$/;
    return reg.test(str);
}

export function replaceStr(obj) {
    let backStr = '';
    let type = obj.type ? obj.type : '';
    let value = obj.value.toString();
    if (type && type === 'commaNum') {
        // 只输入整数字和英文逗号
        backStr = value.replace(/[^0-9,]/g, '');
    } else if (type && type === 'cnEnNum') {
        // 只输入中文 整数字 英文
        backStr = value.replace(/[^\u4E00-\u9FA5_A-Za-z0-9]/g, '');
    } else if (type && type === 'enNum') {
        // 只输入整数字 英文
        backStr = value.replace(/[^A-Za-z0-9]/g, '');
    } else if (type && type === 'cn') {
        // 只输入中文
        backStr = value.replace(/[^\u4E00-\u9FA5]/g, '');
    } else if (type && type === 'int') {
        //整数
        backStr = value.replace(/[^0-9]/g, '');
    } else if (type && type === 'num') {
        //可以输入小数，整数
        backStr = value.replace(/[^\d.]/g, '');
    } else if (type && type === 'enNumChar') {
        //数字 英文 符号
        backStr = value.replace(
            /[^0-9A-Za-z!@#$%&*()_\-+={[}\]|\:;"'<,>.?\/\\~`]/g,
            ''
        );
    } else if (type && type === 'cnChar') {
        // 中文 符号
        backStr = value.replace(
            /[^\u4e00-\u9fa5!@#$%&*()·_\-+={[}\]|\:;"'<,>.?\/\\~`]/g,
            ''
        );
    } else {
        backStr = value;
    }

    // const regex = /^[0-9A-Za-z!@#$%&*()_\-+={[}\]|\:;"'<,>.?\/\\~`]+[0-9A-Za-z!@#$%&*()_\-+={[}\]|\:;"'<,>.?\/\\~`]*$/g;
    return backStr;
}

// 4位数字的取款密码
export function withdrawalPassword(str) {
    const reg = /^[0-9]{4}$/;
    return reg.test(str);
}

export function currencyFormat(str) { // 货币数据模式 13,356,482
    let backStr = '';
    if (_.isNumber(str)) {
        str = str.toString()
    }
    backStr = str.replace(/[0-9]+?(?=(?:([0-9]{3}))+$)/g, function (a) {
        return a + ','
    })
    return backStr;
}


// ///////////////////////////////////////////-----以下为5.0项目中写的正则-------///////////////////////////////////////////////////
// IP地址校验
export function validIP(str) {
    const reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
    return reg.test(str);
}

// 密码验证
export function validatePwd(str) {
    const reg = /^[a-zA-Z0-9]{4,8}$/;
    return reg.test(str);
}

export function validatePwdChange(str) {
    const reg = /^[a-zA-Z0-9]{4,8}$/;
    return reg.test(str);
}

// 用户名账号验证
export function validName(str) {
    const reg = /^[a-zA-Z][a-zA-Z0-9]{3,7}$/;
    return reg.test(str);
}

//校验网址
export function CheckUrl(url) {
    // var reg=/^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    var reg = /(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    return reg.test(url)
}
