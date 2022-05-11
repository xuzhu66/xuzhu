const rulesConfig = [
    {
        name: 'passWordOld',
        reg: /^([A-Za-z0-9]){4,12}$/,
        desc: '请输入4-12位数字和字母的密码'
    },
    {
        name: 'passWord',
        reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,12}$/,
        desc: '请输入8-12位数字和字母的密码'
    },
    {
        name: 'drawPassWord',
        reg: /^\d{4}$/,
        desc: '请输入4位数字的密码'
    },
    {
        name: 'userName',
        reg: /^([A-Za-z0-9]){4,12}$/,
        desc: '请输入4-12位的字母和数字'
    },
    {
        name: 'regUserName',
        reg: /^([A-Za-z])([A-Za-z0-9]){3,7}$/,
        desc: '请输入字母开头，4-8位的字母和数字'
    },
    {
        name: 'regUserNameAll',
        reg: /^([A-Za-z0-9]){4,12}$/,
        desc: '请输入4-8位的字母和数字'
    },
    {
        name: 'vcode',
        reg: /^\d{4}$/,
        desc: '请输入4位数字的验证码'
    },
    {
        name: 'money',
        reg: /^\d+$/,
        desc: '请输入正确的金额'
    },
    {
        name: 'tel',
        reg: /^([1]{1})\d{10}$/,
        desc: '请输入11位手机号码'
    },
    {
        name: 'nonempty',
        reg: /\S/,
        desc: '不能为空 '
    },
    {
        name: 'bankCard',
        reg: /^(\d{16,19})$/,
        desc: '银行卡必须是16到19位的数字'
    },
    {
        name: 'realName',
        reg: /^([\u4e00-\u9fa5]{1})([\u4e00-\u9fa5]|[·]){1,14}$/,
        desc: '请输入1-15位中文可含特殊字符 . '
    },
    {
        name: 'address',
        reg: /^(\S){1,30}$/,
        desc: '请输入1-30位字符'
    },
    {
        name: 'wpwd',
        reg: /^\d{4}$/,
        desc: '请输入4位纯数字的取款密码'
    },
    {
        name: 'wAmount',
        reg: /^\d+(\.\d{0,2})?$/,
        desc: '取款金额只能是数字或含两位小数'
    },
    {
        name: 'depositAmount',
        reg: /^\d+(\.\d{0,2})?$/,
        desc: '请输入正确的金额'
    },
    {
        name: 'cn',
        reg: /^([\u4e00-\u9fa5]){1,20}$/,
        desc: '请输入1-20位中文'
    },
    {
        name: 'any',
        reg: /^(\S){1,15}$/,
        desc: '请输入1-15位字符'
    },
    {
        name: 'adName',
        reg: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,15}$/,
        desc: '请输入2-15位中文,英文字母或数字'
    },
    {
        name: 'virAddress',
        reg: /^([A-Za-z0-9]){10,50}$/,
        desc: '请输入正确的钱包地址'
    },

];
export default rulesConfig;
