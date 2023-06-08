"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.checkLogin = void 0;
var __1 = require("..");
var md5 = require("md5");
var util_1 = require("../util");
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
function checkLogin(event) {
    /** 校验失败 */
    function notLogin() {
        var nowRouteName = __1.router.getNowRouteName();
        if (nowRouteName != 'login')
            location.hash = '/login';
        return false;
    }
    /** 校验成功 */
    function hasLogin() {
        var nowRouteName = __1.router.getNowRouteName();
        if (nowRouteName == 'login')
            location.hash = '';
        return true;
    }
    if (typeof event == 'undefined')
        addEventListener('hashchange', checkLogin);
    var localExpires = localStorage.getItem('expires');
    var nowTimeStamp = new Date().getTime();
    if (!localExpires || parseInt(localExpires) < nowTimeStamp)
        return notLogin();
    return hasLogin();
}
exports.checkLogin = checkLogin;
/** 登录面板 */
var loginBox = document.querySelector('.login-box');
var loginSubEles = {
    /** 用户名或邮箱输入 */
    username: loginBox.querySelector('.input-username'),
    /** 密码输入 */
    password: loginBox.querySelector('.input-password'),
    /** 验证码输入 */
    verCode: loginBox.querySelector('.input-vercode'),
    /** 获取验证码按钮 */
    getVerCode: loginBox.querySelector('.get-vercode'),
    /** 登录按钮 */
    login: loginBox.querySelector('.click-login')
};
/** 注册面板 */
var registerBox = document.querySelector('.register-box');
var registerSubEles = {
    /** 用户名输入 */
    username: registerBox.querySelector('.input-username'),
    /** 密码输入 */
    password: registerBox.querySelector('.input-password'),
    /** 重复输入密码 */
    repeatPassword: registerBox.querySelector('.input-repeat-password'),
    /** 邮箱地址 */
    email: registerBox.querySelector('.input-email'),
    /** 验证码输入 */
    verCode: registerBox.querySelector('.input-vercode'),
    /** 获取验证码按钮 */
    getVerCode: registerBox.querySelector('.get-vercode'),
    /** 注册按钮 */
    register: registerBox.querySelector('.click-register'),
};
var login = function (route) {
    if (route.args[0] == 'register') {
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
    }
    else {
        loginBox.style.display = 'block';
        registerBox.style.display = 'none';
    }
    if (route.status == 0) {
        route.status = 1;
        registerSubEles.register.addEventListener('click', clickRegister);
        registerSubEles.getVerCode.addEventListener('click', function () { return clickGetVerCode(registerSubEles, registerSubEles.email); });
        loginSubEles.login.addEventListener('click', clickLogin);
        loginSubEles.getVerCode.addEventListener('click', function () { return clickGetVerCode(loginSubEles, loginSubEles.username); });
    }
};
exports.login = login;
/** 点击登录 */
function clickLogin() {
}
function clickGetVerCode(eles, emailInputEle) {
    var email = emailInputEle.value;
    if (!(0, util_1.checkEmail)(email))
        return alert('输入的邮箱格式错误，请检查后重新输入');
    eles.getVerCode.setAttribute('disabled', 'disabled');
    eles.getVerCode.innerHTML = '正在发送';
    /** 修改加载中状态 */
    function loading(num) {
        eles.getVerCode.innerHTML = "".concat(num, " \u79D2");
    }
    function end(timer) {
        clearInterval(timer);
        eles.getVerCode.innerHTML = '获取验证码';
        eles.getVerCode.removeAttribute('disabled');
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/sendCode?to=' + email);
    xhr.send();
    xhr.addEventListener('readystatechange', function () {
        if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
            var res = JSON.parse(xhr.responseText);
            if (res.code == 200) {
                var timeLong_1 = 60;
                var timer_1 = setInterval(function () {
                    loading(timeLong_1);
                    if (timeLong_1-- == 0)
                        end(timer_1);
                }, 1000);
                return;
            }
            end();
            alert(res.msg);
        }
    });
}
function clickRegister() {
    var username = registerSubEles.username.value;
    var password = registerSubEles.password.value;
    var repeatPassword = registerSubEles.repeatPassword.value;
    var verCode = registerSubEles.verCode.value;
    var email = registerSubEles.email.value;
    if (!username.match(/^\w{4,20}$/))
        return alert('用户名必须是 4-20 位的数字、字母、下划线任意组合');
    if (!password.match(/^\S{6,20}$/))
        return alert('密码必须是 6-20 位字符串');
    if (password != repeatPassword)
        return alert('两次输入的密码不一致，请检查后重新输入');
    if (!(0, util_1.checkEmail)(email))
        return alert('输入的邮箱格式错误，请检查后重新输入');
    if (verCode.match(/^\s*$/))
        return alert('验证码不能为空');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/register');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var params = new URLSearchParams();
    params.set('username', username);
    params.set('passwordMd5', md5(password));
    params.set('email', email);
    params.set('verCode', verCode);
    xhr.send(params.toString());
    xhr.addEventListener('readystatechange', function () {
        if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
            var res = JSON.parse(xhr.responseText);
            if (res.code == 200) {
                var expires = res.data.expires;
                localStorage.setItem('expires', expires);
                location.hash = '';
                return;
            }
            alert(res.msg);
        }
    });
}
