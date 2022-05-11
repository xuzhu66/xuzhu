import {sendTelephoneCodeApi} from '@/store/comstore/api/apiConfig' // api接口
class TencentCode {
    initTcCodeJs() {
        let captcha = document.getElementById('captcha');
        if (captcha) return
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.id = 'captcha';
        s.src = 'https://ssl.captcha.qq.com/TCaptcha.js';
        document.body.appendChild(s);
    }

    // 发送短信验证码
    sendTelephoneCode(param) {
        // 页面参数:advicePage 0表示非推广页请求，1表示推广页请求
        param.advicePage = 0;
        return new Promise((resolve, reject) => {
            sendTelephoneCodeApi(param).then(response => {
                let res = response
                if (res && res.success) {
                    window.win.tips.toast("发送成功");
                    // 0表示不需要图形验证码，1表示需要图形验证码,2 发送短信成功
                    window.win.store.dispatch("sendMsgStore/setPicCodeCheck", res.data.picCodeCheck);
                } else {
                    window.win.tips.error(res.msg)
                    resolve(res)
                    return
                }
                resolve(res)
            })
        })
    }
}

TencentCode.init = function () {
    return new TencentCode();
};

export default TencentCode;
