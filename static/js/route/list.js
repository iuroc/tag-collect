"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
var config_1 = require("../config");
/** `hash = #/list` */
var list = function (route) {
    if (route.status == 0) {
        route.status = 1;
        var collectListEle_1 = route.dom.querySelector('.collect-list');
        var loadCollectList = function (page, pageSize, keyword) {
            if (page === void 0) { page = 0; }
            if (pageSize === void 0) { pageSize = 36; }
            if (keyword === void 0) { keyword = ''; }
            if (page == 0)
                collectListEle_1.innerHTML = '';
            var xhr = new XMLHttpRequest();
            var params = new URLSearchParams();
            params.set('page', page.toString());
            params.set('pageSize', pageSize.toString());
            params.set('keyword', keyword);
            xhr.open('GET', "".concat(config_1.apiConfig.collectList, "?").concat(params.toString()));
            xhr.send();
            xhr.addEventListener('readystatechange', function () {
                if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
                    var res = JSON.parse(xhr.responseText);
                    if (res.code == 200) {
                        var list_1 = res.data;
                        var html_1 = '';
                        list_1.forEach(function (item) {
                            html_1 += "\n                                <div class=\"col-md-6 col-xl-4 h-100 mb-4\">\n                                    <div class=\"card card-body border border-2 rounded-4 hover-shadow shadow-sm list-group-item-action\">\n                                        <div class=\"fs-5 fw-bold mb-2\">".concat(item.title, "</div>\n                                        <div class=\"text-muted small\">").concat(item.url, "</div>\n                                        <div class=\"text-muted\">").concat(item.text, "</div>\n                                    </div>\n                                </div>");
                        });
                        collectListEle_1.innerHTML += html_1;
                        return;
                    }
                    alert(res.msg);
                }
            });
        };
        loadCollectList();
    }
};
exports.list = list;
