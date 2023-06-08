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
var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;

},{}],3:[function(require,module,exports){
(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();

},{}],4:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],5:[function(require,module,exports){
(function(){
  var crypt = require('crypt'),
      utf8 = require('charenc').utf8,
      isBuffer = require('is-buffer'),
      bin = require('charenc').bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message) && message.constructor !== Uint8Array)
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();

},{"charenc":2,"crypt":3,"is-buffer":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var apee_router_1 = require("apee-router");
var home_1 = require("./route/home");
var login_1 = require("./route/login");
var user_1 = require("./route/user");
var template_1 = require("./template");
exports.router = new apee_router_1.Router();
exports.router.set(['home', 'add', 'list', 'tag', 'user', 'login']);
exports.router.set('home', home_1.home);
exports.router.set('login', login_1.login);
exports.router.set('user', user_1.user);
exports.router.start();
(0, login_1.checkLogin)();
(0, template_1.loadTemplate)(exports.router);

},{"./route/home":7,"./route/login":8,"./route/user":9,"./template":10,"apee-router":1}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
        registerSubEles.getVerCode.addEventListener('click', function () {
            var email = registerSubEles.email.value;
            if (!(0, util_1.checkEmail)(email))
                return alert('输入的邮箱格式错误，请检查后重新输入');
            clickGetVerCode(registerSubEles, email);
        });
        loginSubEles.login.addEventListener('click', clickLogin);
        loginSubEles.getVerCode.addEventListener('click', function () {
            var username = loginSubEles.username.value;
            if (!username.match(/^\w{4,20}$/) && !(0, util_1.checkEmail)(username))
                return alert('用户名或邮箱格式错误');
            clickGetVerCode(loginSubEles, username, true);
        });
    }
};
exports.login = login;
/** 点击登录 */
function clickLogin() {
    var username = loginSubEles.username.value;
    var password = loginSubEles.password.value;
    var verCode = loginSubEles.verCode.value;
    if (!username.match(/^\w{4,20}$/) && !(0, util_1.checkEmail)(username))
        return alert('用户名或邮箱格式错误');
    if (!password.match(/^\S{6,20}$/))
        return alert('密码必须是 6-20 位字符串');
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
function clickGetVerCode(eles, userOrEmail, login) {
    if (login === void 0) { login = false; }
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

},{"..":6,"../util":11,"md5":5}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
var user = function (route) {
    if (route.status == 0) {
        route.status = 1;
        var clickLogout = route.dom.querySelector('.click-logout');
        clickLogout.addEventListener('click', function () {
            localStorage.removeItem('expires');
            location.href = '/logout';
        });
    }
};
exports.user = user;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTemplate = void 0;
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

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmail = void 0;
/** 校验邮箱 */
function checkEmail(email) {
    return email.match(/^[\w.%+-]+@[\w.]+\.[a-zA-Z]{2,}$/);
}
exports.checkEmail = checkEmail;

},{}]},{},[6]);
