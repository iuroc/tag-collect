import { RouteEvent } from 'apee-router'
import { router } from '..'
import * as md5 from 'md5'
import { checkEmail } from '../util'
import { AjaxRes } from '../types'
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
    let localExpires = localStorage.getItem('expires')
    let nowTimeStamp = new Date().getTime()
    if (!localExpires || parseInt(localExpires) < nowTimeStamp)
        return notLogin()
    return hasLogin()
}
/** 登录面板 */
const loginBox = document.querySelector('.login-box') as HTMLDivElement
const loginSubEles = {
    /** 用户名或邮箱输入 */
    username: loginBox.querySelector('.input-username') as HTMLInputElement,
    /** 密码输入 */
    password: loginBox.querySelector('.input-password') as HTMLInputElement,
    /** 验证码输入 */
    verCode: loginBox.querySelector('.input-vercode') as HTMLInputElement,
    /** 获取验证码按钮 */
    getVerCode: loginBox.querySelector('.get-vercode') as HTMLButtonElement,
    /** 登录按钮 */
    login: loginBox.querySelector('.click-login') as HTMLButtonElement
}
/** 注册面板 */
const registerBox = document.querySelector('.register-box') as HTMLDivElement
const registerSubEles = {
    /** 用户名输入 */
    username: registerBox.querySelector('.input-username') as HTMLInputElement,
    /** 密码输入 */
    password: registerBox.querySelector('.input-password') as HTMLInputElement,
    /** 重复输入密码 */
    repeatPassword: registerBox.querySelector('.input-repeat-password') as HTMLInputElement,
    /** 邮箱地址 */
    email: registerBox.querySelector('.input-email') as HTMLInputElement,
    /** 验证码输入 */
    verCode: registerBox.querySelector('.input-vercode') as HTMLInputElement,
    /** 获取验证码按钮 */
    getVerCode: registerBox.querySelector('.get-vercode') as HTMLButtonElement,
    /** 注册按钮 */
    register: registerBox.querySelector('.click-register') as HTMLButtonElement,
}
export const login: RouteEvent = (route) => {
    if (route.args[0] == 'register') {
        loginBox.style.display = 'none'
        registerBox.style.display = 'block'
    } else {
        loginBox.style.display = 'block'
        registerBox.style.display = 'none'
    }
    if (route.status == 0) {
        route.status = 1
        registerSubEles.register.addEventListener('click', clickRegister)
        registerSubEles.getVerCode.addEventListener('click', () => {
            let email = registerSubEles.email.value
            if (!checkEmail(email)) return alert('输入的邮箱格式错误，请检查后重新输入')
            clickGetVerCode(registerSubEles, email)
        })
        loginSubEles.login.addEventListener('click', clickLogin)
        loginSubEles.getVerCode.addEventListener('click', () => {
            let username = loginSubEles.username.value
            if (!username.match(/^\w{4,20}$/) && !checkEmail(username))
                return alert('用户名或邮箱格式错误')
            clickGetVerCode(loginSubEles, username, true)
        })
    }
}

/** 点击登录 */
function clickLogin() {
    let username = loginSubEles.username.value
    let password = loginSubEles.password.value
    let verCode = loginSubEles.verCode.value
    if (!username.match(/^\w{4,20}$/) && !checkEmail(username))
        return alert('用户名或邮箱格式错误')
    if (!password.match(/^\S{6,20}$/)) return alert('密码必须是 6-20 位字符串')
    if (verCode.match(/^\s*$/)) return alert('验证码不能为空')
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/login')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    const params = new URLSearchParams()
    params.set('username', username)
    params.set('passwordMd5', md5(password))
    params.set('verCode', verCode)
    xhr.send(params.toString())
    xhr.addEventListener('readystatechange', () => {
        if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
            const res = JSON.parse(xhr.responseText) as AjaxRes
            if (res.code == 200) {
                alert('登录成功')
                let expires = res.data.expires as string
                localStorage.setItem('expires', expires)
                location.hash = ''
                return
            }
            alert(res.msg)
        }
    })
}

function clickGetVerCode(eles: { [key: string]: HTMLDivElement | HTMLButtonElement },
    userOrEmail: string, login: boolean = false) {

    eles.getVerCode.setAttribute('disabled', 'disabled')
    eles.getVerCode.innerHTML = '正在发送'

    /** 修改加载中状态 */
    function loading(num: number) {
        eles.getVerCode.innerHTML = `${num} 秒`
    }

    function end(timer?: NodeJS.Timer) {
        clearInterval(timer)
        eles.getVerCode.innerHTML = '获取验证码'
        eles.getVerCode.removeAttribute('disabled')
    }

    const xhr = new XMLHttpRequest()
    xhr.open('GET', `/api/sendCode?to=${userOrEmail}&login=${login}`)
    xhr.send()
    xhr.addEventListener('readystatechange', () => {
        if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
            const res = JSON.parse(xhr.responseText) as AjaxRes
            if (res.code == 200) {
                let timeLong = 60
                const timer = setInterval(() => {
                    loading(timeLong)
                    if (timeLong-- == 0) end(timer)
                }, 1000)
                return
            }
            end()
            alert(res.msg)
        }
    })
}

function clickRegister() {
    let username = registerSubEles.username.value
    let password = registerSubEles.password.value
    let repeatPassword = registerSubEles.repeatPassword.value
    let verCode = registerSubEles.verCode.value
    let email = registerSubEles.email.value
    if (!username.match(/^\w{4,20}$/)) return alert('用户名必须是 4-20 位的数字、字母、下划线任意组合')
    if (!password.match(/^\S{6,20}$/)) return alert('密码必须是 6-20 位字符串')
    if (password != repeatPassword) return alert('两次输入的密码不一致，请检查后重新输入')
    if (!checkEmail(email)) return alert('输入的邮箱格式错误，请检查后重新输入')
    if (verCode.match(/^\s*$/)) return alert('验证码不能为空')
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/register')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    const params = new URLSearchParams()
    params.set('username', username)
    params.set('passwordMd5', md5(password))
    params.set('email', email)
    params.set('verCode', verCode)
    xhr.send(params.toString())
    xhr.addEventListener('readystatechange', () => {
        if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
            const res = JSON.parse(xhr.responseText) as AjaxRes
            if (res.code == 200) {
                alert('注册成功，即将自动登录')
                let expires = res.data.expires as string
                localStorage.setItem('expires', expires)
                location.hash = ''
                return
            }
            alert(res.msg)
        }
    })
}