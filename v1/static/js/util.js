"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTitleByUrl = void 0;
var config_1 = require("./config");
/** 通过 `URL` 获取标题 */
function getTitleByUrl(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', config_1.apiConfig.getTitle + encodeURIComponent(url), true);
        xhr.timeout = 3000;
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.status == 200 && xhr.readyState == 4) {
                var res = JSON.parse(xhr.responseText);
                resolve(res.data);
            }
        };
        xhr.onerror = xhr.ontimeout = reject;
    });
}
exports.getTitleByUrl = getTitleByUrl;
