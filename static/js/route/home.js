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
