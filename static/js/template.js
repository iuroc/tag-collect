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
 * @param isRow 是否使用响应式栅栏
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
    document.querySelectorAll('back-nav-row').forEach(function (ele) {
        var _a;
        var title = ele.innerHTML;
        var newEle = document.createElement('dvi');
        newEle.classList.add('row');
        var html = "\n            <div class=\"col-xl-8 col-lg-7 col-md-6\">\n                <div class=\"d-flex mb-4 align-items-center back-nav\">\n                    <img src=\"/static/img/arrow-left-circle.svg\" class=\"cursor-pointer size-32 back-btn\">\n                    <div class=\"fs-3 fw-bold ms-3\">".concat(title, "</div>\n                </div>\n            </div>\n            <div class=\"col-xl-4 col-lg-5 col-md-6 mb-4\">\n                <div class=\"input-group shadow-sm rounded input-group\">\n                    <input type=\"text\" placeholder=\"\u8BF7\u8F93\u5165\u641C\u7D22\u5173\u952E\u8BCD\" class=\"form-control\">\n                    <button class=\"btn btn-success\">\u641C\u7D22</button>\n                </div>\n            </div>");
        newEle.innerHTML = html;
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
