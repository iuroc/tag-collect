"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = void 0;
var util_1 = require("../util");
var config_1 = require("../config");
/** `hash = #/add` */
var add = function (route) {
    if (route.status == 0) {
        route.status = 1;
        var elementGroup_1 = {
            input: {
                url: route.dom.querySelector('.input-url'),
                title: route.dom.querySelector('.input-title'),
                tag: route.dom.querySelector('.input-tag'),
            },
            textarea: {
                text: route.dom.querySelector('.input-text'),
            },
            button: {
                getOrigin: route.dom.querySelector('.get-origin'),
                getTitle: route.dom.querySelector('.get-title'),
                submit: route.dom.querySelector('.submit'),
                reset: route.dom.querySelector('.reset'),
                addTag: route.dom.querySelector('.add-tag')
            },
            div: {
                tagList: route.dom.querySelector('.tag-list')
            }
        };
        elementGroup_1.button.getOrigin.addEventListener('click', function () {
            var ele = elementGroup_1.input.url;
            ele.focus();
            try {
                ele.value = new URL(ele.value).origin;
            }
            catch (_a) { }
        });
        elementGroup_1.button.getTitle.addEventListener('click', function () {
            getTitle(elementGroup_1);
        });
        elementGroup_1.button.addTag.addEventListener('click', function () {
        });
    }
};
exports.add = add;
function getTitle(eleGroup) {
    var url = eleGroup.input.url.value;
    if (!(0, util_1.checkUrl)(url))
        return alert('输入的 URL 不合法');
    eleGroup.button.getTitle.setAttribute('disabled', 'disabled');
    eleGroup.button.getTitle.innerHTML = '正在抓取';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', config_1.apiConfig.getTitle + encodeURIComponent(url));
    xhr.timeout = 5000;
    xhr.send();
    var endStatus = function () {
        eleGroup.button.getTitle.removeAttribute('disabled');
        eleGroup.button.getTitle.innerHTML = '自动抓取';
    };
    xhr.addEventListener('readystatechange', function () {
        if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
            var res = JSON.parse(xhr.responseText);
            endStatus();
            if (res.code == 200) {
                eleGroup.input.title.value = res.data;
                return;
            }
            alert(res.msg);
        }
    });
    xhr.onerror = xhr.ontimeout = endStatus;
}
