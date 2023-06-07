(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
/**
 * APEE 路由管理模块
 * @author 欧阳鹏
 * @version 1.2.1
 * @link https://github.com/oyps/apee-router
 */
var ApeeRouter = /** @class */ (function () {
    /**
     * 实例化路由管理模块
     * @param options 配置选项
     */
    function ApeeRouter(options) {
        /** 路由列表 */
        this.routeList = {};
        /** 是否发生过 `hashChange` 事件 */
        this.hashChanged = false;
        if (options === null || options === void 0 ? void 0 : options.default)
            this.setDefaultRoute(options.default);
        if (options === null || options === void 0 ? void 0 : options.routeSet)
            this.setRouteOption(options.routeSet);
    }
    ApeeRouter.prototype.setRouteOption = function (routeSet) {
        var _this_1 = this;
        if (!Array.isArray(routeSet))
            throw new Error('routeSet 类型错误');
        routeSet.forEach(function (set) {
            if (typeof set == 'string')
                _this_1.set(set);
            else if (Array.isArray(set)) {
                if (set.length == 2 && typeof set[1] != 'string')
                    _this_1.set.apply(_this_1, set);
                else
                    _this_1.set(set);
            }
            else {
                throw new Error('routeSet 类型错误');
            }
        });
    };
    /**
     * 设置默认路由
     * @param _default 默认路由选项
     */
    ApeeRouter.prototype.setDefaultRoute = function (_default) {
        if (typeof _default == 'string')
            this.defaultRoute = this.set(_default)[0];
        else if (Array.isArray(_default))
            this.defaultRoute = this.set.apply(this, _default)[0];
        else
            throw new Error('default 选项类型错误');
    };
    /**
     * 设置路由
     * @param routeName 路由名称，可通过数组传入多个
     * @param routeEvent 路由事件，可通过数组传入多个
     */
    ApeeRouter.prototype.set = function (routeName, routeEvent) {
        var _a;
        var routeNames = Array.isArray(routeName) ? routeName : [routeName];
        var routes = [];
        for (var i = 0; i < routeNames.length; i++) {
            var routeName_1 = routeNames[i];
            var routeEvents = routeEvent ? Array.isArray(routeEvent) ? routeEvent : [routeEvent] : [];
            var route = this.routeList[routeName_1];
            // 路由已经存在，追加路由事件列表
            if (route) {
                (_a = route.event).push.apply(_a, routeEvents);
                routes.push(route);
                continue;
            }
            // 路由不存在，开始创建新路由
            var dom = this.getRouteDom(routeName_1);
            // 路由对应的 DOM 不存在
            if (!dom)
                throw new Error("data-route=\"".concat(routeName_1, "\" \u7684 HTML \u5143\u7D20\u6CA1\u6709\u627E\u5230"));
            // 创建新路由
            var newRoute = this.routeList[routeName_1] = {
                name: routeName_1,
                event: routeEvents,
                dom: dom,
                data: {},
                args: [],
                status: 0
            };
            routes.push(newRoute);
        }
        return routes;
    };
    ApeeRouter.prototype.getRouteDom = function (routeName, exclude) {
        if (exclude === void 0) { exclude = false; }
        var selector;
        if (exclude && routeName)
            selector = "[data-route]:not([data-route=\"".concat(routeName, "\"]");
        else
            selector = routeName ? "[data-route=\"".concat(routeName, "\"]") : '[data-route]';
        var result = document.querySelectorAll(selector);
        if (routeName && !exclude && result.length == 0)
            throw new Error("".concat(selector, " \u5143\u7D20\u4E0D\u5B58\u5728"));
        return routeName && !exclude ? result[0] : result;
    };
    /**
     * 载入路由
     * @param route 路由对象
     * @param args 路由参数
     */
    ApeeRouter.prototype.loadRoute = function (route, args) {
        var _this_1 = this;
        if (args === void 0) { args = []; }
        this.getRouteDom(route.name, true).forEach(function (dom) {
            dom.style.display = 'none';
        });
        this.getRouteDom(route.name).style.display = 'block';
        route.args = args;
        route.event.forEach(function (event) { return event(route, _this_1); });
    };
    /** 启动路由系统 */
    ApeeRouter.prototype.start = function () {
        var _this_1 = this;
        var _this = this;
        var listener = function (event) {
            if (event)
                _this_1.hashChanged = true;
            var newUrl = (event === null || event === void 0 ? void 0 : event.newURL) || location.href;
            var newHash = new URL(newUrl).hash;
            var args = newHash.split('/').slice(2);
            if (newHash == '')
                return _this.loadRoute(_this.defaultRoute, args);
            var routeName = newHash.split('/')[1];
            var route = _this.routeList[routeName];
            if (!route)
                return location.hash = '';
            _this.loadRoute(route, args);
        };
        if (!this.defaultRoute)
            this.setDefaultRoute('home');
        window.addEventListener('hashchange', listener);
        listener();
    };
    /**
     * 获取当前路由名称
     * @returns 当前路由名称
     * @since 1.1.18
     */
    ApeeRouter.prototype.getNowRouteName = function () {
        return location.hash == '' ? this.defaultRoute.name : location.hash.split('/')[1];
    };
    /** 工具类 */
    ApeeRouter.util = {
        /** 显示元素 */
        show: function (dom) {
            if (!dom)
                return;
            var doms = dom instanceof Node ? [dom] : dom;
            doms.forEach(function (dom) { return dom.style.display = 'block'; });
        },
        /** 隐藏 DOM */
        hide: function (dom) {
            if (!dom)
                return;
            var doms = dom instanceof Node ? [dom] : dom;
            doms.forEach(function (dom) { return dom.style.display = 'none'; });
        },
    };
    return ApeeRouter;
}());
exports.Router = ApeeRouter;
exports.default = ApeeRouter;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var apee_router_1 = require("apee-router");
var home_1 = require("./route/home");
var login_1 = require("./route/login");
exports.router = new apee_router_1.Router();
exports.router.set(['home', 'add', 'list', 'tag', 'user', 'login']);
exports.router.set('home', home_1.home);
exports.router.set('login', login_1.login);
exports.router.start();
(0, login_1.checkLogin)();

},{"./route/home":3,"./route/login":4,"apee-router":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.home = void 0;
var home = function (route) {
    function loadDom() {
        var html = '';
        var boxEle = route.dom.querySelector('.btn-list');
        if (!boxEle)
            throw new Error(".btn-list \u5143\u7D20\u4E0D\u5B58\u5728");
        var list = [
            ['plus-square-dotted.svg', '新增收藏', 'add'],
            ['card-checklist.svg', '收藏列表', 'list'],
            ['tags.svg', '标签列表', 'tag'],
            ['person-gear.svg', '个人中心', 'user'],
        ];
        list.forEach(function (item) {
            html += "\n                <div class=\"col-sm-6 col-lg-4 col-xl-3 mb-4\">\n                    <div class=\"border border-3 shadow-sm rounded-4 card card-body\n                        hover-shadow flex-row align-items-center\" onclick=\"location.hash='#/".concat(item[2], "'\">\n                        <img src=\"/static/img/").concat(item[0], "\" class=\"mx-3 size-32\">\n                        <div class=\"fs-4\">").concat(item[1], "</div>\n                    </div>\n                </div>");
        });
        boxEle.innerHTML = html;
    }
    if (route.status == 0) {
        route.status = 1;
        loadDom();
    }
};
exports.home = home;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.checkLogin = void 0;
var __1 = require("..");
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
    var localToken = localStorage.getItem('token');
    var localExpires = localStorage.getItem('expires');
    var nowTimeStamp = new Date().getTime();
    if (!localToken || !localExpires || parseInt(localExpires) < nowTimeStamp)
        return notLogin();
    return hasLogin();
}
exports.checkLogin = checkLogin;
/** 登录面板 */
var loginBox = document.querySelector('.login-box');
/** 注册面板 */
var registerBox = document.querySelector('.register-box');
var login = function (route) {
    if (route.args[0] == 'register') {
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
    }
    else {
        loginBox.style.display = 'block';
        registerBox.style.display = 'none';
    }
};
exports.login = login;

},{"..":2}]},{},[2]);
