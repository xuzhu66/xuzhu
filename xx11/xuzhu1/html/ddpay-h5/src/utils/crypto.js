import CryptoJS from 'crypto-js'
import JSEncrypt from 'jsencrypt'

// 75WcTKsBsxhWKQsMJwQ74DJWnHjErNaa
const localk = '75WcTKsBsxhWKQsMJwQ74DJWnHjErNaa'

export function randomString(len) {
  len = len || 32
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

export const cryptoObjAES = {
  // 加密
  encrypt(word, keyStr, ivStr) {
    ivStr = keyStr.slice(0, 16)
    // return CryptoJS.AES.encrypt(word, keyStr).toString()
    const key = CryptoJS.enc.Utf8.parse(keyStr)
    const iv = CryptoJS.enc.Utf8.parse(ivStr)
    return CryptoJS.AES.encrypt(word, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      adding: CryptoJS.pad.Pkcs7
    }).toString()
  },
  // 解密
  decrypt(ciphertext, keyStr, ivStr) {
    ivStr = keyStr.slice(0, 16)
    // const bytes = CryptoJS.AES.decrypt(ciphertext, keyStr)
    // return bytes.toString(CryptoJS.enc.Utf8)
    const key = CryptoJS.enc.Utf8.parse(keyStr)
    const iv = CryptoJS.enc.Utf8.parse(ivStr)

    const decrypt = CryptoJS.AES.decrypt(ciphertext, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    return decrypt.toString(CryptoJS.enc.Utf8)
  }
}

export function cryptoObjRSA(hashStr) {
  const enStr = process.env['VUE_APP_EN_KEY']
  const dePublicKey = cryptoObjAES.decrypt(enStr, localk)
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(dePublicKey)
  const str = encrypt.encrypt(hashStr)
  return str
}
