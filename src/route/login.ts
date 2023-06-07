import { RouteEvent } from 'apee-router'
import { router } from '..'

/**
 * 校验登录
 * @param event 事件对象
 * 
 * **登录校验机制**
 * 1. 前端传入账号和密文密码
 * 2. 后端数据库存储账号和密文密码
 * 3. 后端校验账号和密文密码
 * 4. 校验成功后，后端生成 `Token` 并存入数据库
 * 5. 后端返回 `Cookie-Token` 和 `Response-Token-Expires(13)`
 * 6. 前端通过 `Token` 存在性和 `Expires` 初步判断登录状态
 * 7. 每个 HTTP API 都对 `Cookie-Token` 进行校验
 * 8. 后端校验失败，返回错误信息，清除 `Cookie`
 * 9. 前端获得错误信息，清除本地存储中的 `Token` 和 `Expires`
 */
export function checkLogin(event?: HashChangeEvent) {
    /** 校验失败 */
    function notLogin() {
        let nowRouteName = router.getNowRouteName()
        if (nowRouteName != 'login')
            location.hash = '/login'
        return false
    }
    /** 校验成功 */
    function hasLogin() {
        let nowRouteName = router.getNowRouteName()
        if (nowRouteName == 'login')
            location.hash = ''
        return true
    }
    if (typeof event == 'undefined')
        addEventListener('hashchange', checkLogin)
    let localToken = localStorage.getItem('token')
    let localExpires = localStorage.getItem('expires')
    let nowTimeStamp = new Date().getTime()
    if (!localToken || !localExpires || parseInt(localExpires) < nowTimeStamp)
        return notLogin()
    return hasLogin()
}
/** 登录面板 */
const loginBox = document.querySelector('.login-box') as HTMLDivElement
/** 注册面板 */
const registerBox = document.querySelector('.register-box') as HTMLDivElement
export const login: RouteEvent = (route) => {
    if (route.args[0] == 'register') {
        loginBox.style.display = 'none'
        registerBox.style.display = 'block'
    } else {
        loginBox.style.display = 'block'
        registerBox.style.display = 'none'
    }
}