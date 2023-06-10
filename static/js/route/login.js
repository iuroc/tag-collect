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
/** 登录面板表单 */
var loginForm = {
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
/** 注册面板表单 */
var registerForm = {
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
        // 单击注册事件
        registerForm.register.addEventListener('click', clickRegister);
        // 单击获取验证码事件
        registerForm.getVerCode.addEventListener('click', function () {
            var email = registerForm.email.value;
            if (!(0, util_1.checkEmail)(email))
                return alert('请输入正确的邮箱');
            sendVerCode(registerForm, email);
        });
        loginForm.login.addEventListener('click', clickLogin);
        loginForm.getVerCode.addEventListener('click', function () {
            var username = loginForm.username.value;
            if (username.match(/^\s*$/))
                return alert('用户名或邮箱不能为空');
            sendVerCode(loginForm, username, true);
        });
    }
};
exports.login = login;
/** 点击登录事件 */
function clickLogin() {
    var username = loginForm.username.value;
    var password = loginForm.password.value;
    var verCode = loginForm.verCode.value;
    if (username.match(/^\s*$/))
        return alert('用户名或邮箱不能为空');
    console.log(password.match(/^\s*$/));
    if (password.length == 0)
        return alert('密码不能为空');
    if (verCode.match(/^\s*$/))
        return alert('验证码不能为空');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/login');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var params = new URLSearchParams();
    params.set('username', username);
    params.set('passwordMd5', md5(password));
    params.set('verCode', verCode);
    xhr.send(params.toString());
    xhr.addEventListener('readystatechange', function () {
        if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
            var res = JSON.parse(xhr.responseText);
            if (res.code == 200) {
                alert('登录成功');
                var expires = res.data.expires;
                localStorage.setItem('expires', expires);
                location.hash = '';
                return;
            }
            alert(res.msg);
        }
    });
}
/**
 * 点击发送验证码
 * @param form 表单元素集合
 * @param userOrEmail 用户名或邮箱
 * @param login 是否是登录模式
 */
function sendVerCode(form, userOrEmail, login) {
    if (login === void 0) { login = false; }
    form.getVerCode.setAttribute('disabled', 'disabled');
    form.getVerCode.innerHTML = '正在发送';
    /** 修改倒计时 */
    function loading(num) {
        form.getVerCode.innerHTML = "".concat(num, " \u79D2");
    }
    /** 结束倒计时 */
    function end(timer) {
        clearInterval(timer);
        form.getVerCode.innerHTML = '获取验证码';
        form.getVerCode.removeAttribute('disabled');
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/api/sendCode?to=".concat(userOrEmail, "&login=").concat(login));
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
/** 单击注册事件 */
function clickRegister() {
    var username = registerForm.username.value;
    var password = registerForm.password.value;
    var repeatPassword = registerForm.repeatPassword.value;
    var verCode = registerForm.verCode.value;
    var email = registerForm.email.value;
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
                alert('注册成功，即将自动登录');
                var expires = res.data.expires;
                localStorage.setItem('expires', expires);
                location.hash = '';
                return;
            }
            alert(res.msg);
        }
    });
}
