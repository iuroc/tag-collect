import { RouteEvent } from 'apee-router'
import { router } from '..'
import * as md5 from 'md5'
import { checkEmail } from '../util'
import { AjaxRes } from '../types'
/**
 * 校验登录
 * @param event 事件对象
 *
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
/** 登录面板表单 */
const loginForm = {
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
/** 注册面板表单 */
const registerForm = {
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
        // 单击注册事件
        registerForm.register.addEventListener('click', clickRegister)
        // 单击获取验证码事件
        registerForm.getVerCode.addEventListener('click', () => {
            let email = registerForm.email.value
            if (!checkEmail(email)) return alert('请输入正确的邮箱')
            sendVerCode(registerForm, email)
        })
        loginForm.login.addEventListener('click', clickLogin)
        loginForm.getVerCode.addEventListener('click', () => {
            let username = loginForm.username.value
            if (username.match(/^\s*$/))
                return alert('用户名或邮箱不能为空')
            sendVerCode(loginForm, username, true)
        })
    }
}

/** 点击登录事件 */
function clickLogin() {
    let username = loginForm.username.value
    let password = loginForm.password.value
    let verCode = loginForm.verCode.value
    if (username.match(/^\s*$/)) return alert('用户名或邮箱不能为空')
    console.log(password.match(/^\s*$/))
    if (password.length == 0) return alert('密码不能为空')
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

/**
 * 点击发送验证码
 * @param form 表单元素集合
 * @param userOrEmail 用户名或邮箱
 * @param login 是否是登录模式
 */
function sendVerCode(
    form: {
        [key: string]: HTMLDivElement | HTMLButtonElement
    },
    userOrEmail: string,
    login: boolean = false
) {
    form.getVerCode.setAttribute('disabled', 'disabled')
    form.getVerCode.innerHTML = '正在发送'
    /** 修改倒计时 */
    function loading(num: number) {
        form.getVerCode.innerHTML = `${num} 秒`
    }
    /** 结束倒计时 */
    function end(timer?: NodeJS.Timer) {
        clearInterval(timer)
        form.getVerCode.innerHTML = '获取验证码'
        form.getVerCode.removeAttribute('disabled')
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


/** 单击注册事件 */
function clickRegister() {
    let username = registerForm.username.value
    let password = registerForm.password.value
    let repeatPassword = registerForm.repeatPassword.value
    let verCode = registerForm.verCode.value
    let email = registerForm.email.value
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