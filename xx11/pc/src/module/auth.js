import Cookies from 'js-cookie'

const TokenKey = 'VVV-Token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function getRefresToken() {
    return Cookies.get('refresToken')
}

export function setRefresToken(token) {
    return Cookies.set('refresToken', token);
}

export function removeRefresToken() {
    return Cookies.remove('refresToken')
}
