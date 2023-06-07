(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * APEE 路由管理模块
 * @author 欧阳鹏
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
exports.default = ApeeRouter;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.apiConfig = void 0;
/** API 接口配置 */
exports.apiConfig = {
    /** 网页标题获取，`=` 结尾，内置接口为 `/api/get_title` */
    getTitle: 'https://get-html.9494666.xyz/?type=title&url=',
    /** 新增收藏 */
    add: '/api/add',
    /** 获取标签列表 */
    getTag: '/api/tag_list'
};
/** 网站配置 */
exports.config = {
    /** API 接口配置 */
    api: exports.apiConfig
};

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apee_router_1 = require("apee-router");
var add_1 = require("./route/add");
var home_1 = require("./route/home");
var tag_1 = require("./route/tag");
var template_1 = require("./template");
var router = new apee_router_1.default();
router.set(['home', 'add', 'list', 'tag', 'user']);
router.set('home', home_1.default);
router.set('add', add_1.default);
router.set('tag', tag_1.default);
router.start();
(0, template_1.loadTemplate)(router);

},{"./route/add":4,"./route/home":5,"./route/tag":6,"./template":7,"apee-router":1}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** `hash = #/add` */
exports.default = (function (route) {
});
/*
1. 网址输入框，按钮点击获取根地址
2. 标题输入框，按钮点击自动抓取
3. 标签输入框，输入后，自动搜索并显示下拉菜单，如果是没有用过的标签，则显示新增这个标签，否则就直接显示标签，点击标签可以添加标签
4. 文本输入框，增加编辑器
*/ 

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** `hash = #/home` */
var routeEvent = function (route) {
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
exports.default = routeEvent;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
/** `hash = #/tag` */
var routeEvent = function (route, router) {
    if (route.args[0] == 'call' && router.hashChanged) {
        // 用作回调的标签选择器
    }
    else {
    }
    loadTagList(route);
};
/** 加载标签列表 */
function loadTagList(route) {
    var xhr = new XMLHttpRequest();
    /** 全部标签的容器 */
    var tagListDom = route.dom.querySelector('.tag-list');
    /** 最近使用的标签列表容器 */
    var recentTagListDom = route.dom.querySelector('.recent-tag-list');
    var searchBox = route.dom.querySelector('.search-box');
    // 页面载入，将已选中的标签列表记录清空
    route.data.tagSelectedList = [];
    tagListDom.innerHTML = recentTagListDom.innerHTML = '';
    /** 路由存储区数据：当前页面被选中的标签列表 */
    var tagSelectedList = route.data.tagSelectedList;
    xhr.open('GET', config_1.apiConfig.getTag);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            var res = JSON.parse(xhr.responseText);
            if (res.code == 200) {
                if (Object.keys(res.data).length == 0) {
                    searchBox.classList.add('d-none');
                    tagListDom.innerHTML = '<div class="lead">标签列表为空，快去添加收藏吧</div>';
                    return;
                }
                searchBox.classList.remove('d-none');
                /** 最近使用的标签列表 */
                var recentTag_1 = res.data.recent;
                /** 完整标签列表 */
                var allTag = res.data.all;
                // 载入最近使用标签列表
                recentTagListDom.innerHTML = '';
                recentTag_1.forEach(function (tag) {
                    addNewTag(tag, null, recentTagListDom, recentTag_1, route);
                });
                // 载入所有标签列表
                tagListDom.innerHTML = '';
                allTag.forEach(function (row) {
                    var tag = row[0], num = row[1];
                    addNewTag(tag, num, tagListDom, recentTag_1, route);
                });
                return;
            }
            alert(res.msg);
        }
    };
}
/**
 * 增加一个标签元素
 * @param tagName 标签名称
 * @param count 标签的使用次数
 * @param listDom 需要将标签插入到哪个列表 DOM
 * @param markList 需要被标记的标签列表，使用 `data-mark-index` 标记
 * @param route 当前路由对象
 */
function addNewTag(tagName, count, listDom, markList, route) {
    /** 新标签元素 */
    var newTag = document.createElement('button');
    /** 标签元素中的【标签文本】元素 */
    // const tagText = makeTagText(tagName)
    newTag.innerText = tagName;
    newTag.setAttribute('class', 'btn border border-2 mb-3 mx-1 shadow-sm');
    // newTag.append(tagText)
    var badgeSpan;
    if (count != null) {
        /** 标签元素中的【标签使用次数】文本元素 */
        badgeSpan = makeBadgeSpan(count);
        newTag.append(badgeSpan);
    }
    var index = getMarkIndex(tagName, markList);
    if (index > -1)
        newTag.setAttribute('data-mark-index', index.toString());
    listDom.append(newTag);
    newTag.addEventListener('click', function () {
        var market = newTag.getAttribute('data-mark-index');
        if (market != null) {
            route.dom.querySelectorAll("[data-mark-index=\"".concat(market, "\"]")).forEach(function (ele) {
                click(ele, ele.querySelector('.badge'));
            });
        }
        else {
            click(newTag, badgeSpan);
        }
    });
}
function click(tagDom, badgeSpan) {
    var _a, _b;
    /** 被选中的标签需要增加的类 */
    var selectedClass = ['border-primary', 'text-primary'];
    if (tagDom.classList.contains('text-primary')) {
        // 取消选中
        (_a = tagDom.classList).remove.apply(_a, selectedClass);
        badgeSpan === null || badgeSpan === void 0 ? void 0 : badgeSpan.classList.remove('bg-primary', 'border-primary');
        badgeSpan === null || badgeSpan === void 0 ? void 0 : badgeSpan.classList.add('text-bg-light');
    }
    else {
        // 选中
        (_b = tagDom.classList).add.apply(_b, selectedClass);
        badgeSpan === null || badgeSpan === void 0 ? void 0 : badgeSpan.classList.remove('text-bg-light');
        badgeSpan === null || badgeSpan === void 0 ? void 0 : badgeSpan.classList.add('bg-primary', 'border-primary');
    }
}
function makeBadgeSpan(count) {
    var badgeSpan = document.createElement('span');
    badgeSpan.classList.add('badge', 'text-bg-light', 'border', 'ms-2');
    badgeSpan.innerText = count.toString();
    return badgeSpan;
}
/** 获取标签名称在被标记标签列表中的下标，如果没有找到，将返回 `-1` */
function getMarkIndex(tagName, markList) {
    for (var i = 0; i < markList.length; i++) {
        var item = markList[i];
        var markName = typeof item == 'string' ? item : item[0];
        if (markName == tagName)
            return i;
    }
    return -1;
}
exports.default = routeEvent;

},{"../config":2}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTemplate = void 0;
/** 载入组件 */
function loadTemplate(router) {
    loadBackNav(router);
    loadSubTitle();
}
exports.loadTemplate = loadTemplate;
/**
 * 加载带返回按钮的顶栏
 * @param router 路由管理器对象，用于实现返回上一级历史记录
 */
function loadBackNav(router) {
    /** 返回上一级事件 */
    var backEvent = function () {
        // 如果发生过 hashChange 事件，则返回上一级，否则转到空路由
        if (router.hashChanged)
            history.back();
        else
            location.hash = '';
    };
    document.querySelectorAll('back-nav').forEach(function (ele) {
        var _a;
        var title = ele.innerHTML;
        var newEle = document.createElement('div');
        newEle.classList.add('d-flex', 'mb-4', 'align-items-center');
        newEle.innerHTML = "\n            <img src=\"/static/img/arrow-left-circle.svg\" class=\"cursor-pointer size-32 back-btn\">\n            <div class=\"fs-3 fw-bold ms-3\">".concat(title, "</div>");
        (_a = newEle.querySelector('.back-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', backEvent);
        ele.replaceWith(newEle);
    });
}
/** 加载带图标的小标题 */
function loadSubTitle() {
    document.querySelectorAll('sub-title').forEach(function (ele) {
        var title = ele.innerHTML;
        var newEle = document.createElement('div');
        newEle.classList.add('d-flex', 'mb-4', 'align-items-center');
        newEle.innerHTML = "\n            <img src=\"/static/img/tags.svg\" class=\"cursor-pointer size-20 back-btn\">\n            <div class=\"fs-5 fw-bold ms-2\">".concat(title, "</div>");
        ele.replaceWith(newEle);
    });
}

},{}]},{},[3]);
