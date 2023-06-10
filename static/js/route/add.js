"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = void 0;
var util_1 = require("../util");
var config_1 = require("../config");
/** `hash = #/add` */
var add = function (route) {
    if (route.status == 0) {
        route.status = 1;
        /** 标签列表 */
        var tagList_1 = [];
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
                tagList: route.dom.querySelector('.tag-list'),
                searchResult: route.dom.querySelector('.search-result-list')
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
            var url = elementGroup_1.input.url.value;
            if (!(0, util_1.checkUrl)(url))
                return alert('输入的 URL 不合法');
            elementGroup_1.button.getTitle.setAttribute('disabled', 'disabled');
            elementGroup_1.button.getTitle.innerHTML = '正在抓取';
            var xhr = new XMLHttpRequest();
            xhr.open('GET', config_1.apiConfig.getTitle + encodeURIComponent(url));
            xhr.timeout = 5000;
            xhr.send();
            var endStatus = function () {
                elementGroup_1.button.getTitle.removeAttribute('disabled');
                elementGroup_1.button.getTitle.innerHTML = '自动抓取';
            };
            xhr.addEventListener('readystatechange', function () {
                if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
                    var res = JSON.parse(xhr.responseText);
                    endStatus();
                    if (res.code == 200) {
                        elementGroup_1.input.title.value = res.data;
                        return;
                    }
                    alert(res.msg);
                }
            });
            xhr.onerror = xhr.ontimeout = endStatus;
        });
        elementGroup_1.input.url.addEventListener('keyup', function (event) {
            if (event.key == 'Enter')
                elementGroup_1.button.getOrigin.click();
        });
        elementGroup_1.input.title.addEventListener('keyup', function (event) {
            if (event.key == 'Enter')
                elementGroup_1.button.getTitle.click();
        });
        /** 标签列表为空时的提示元素 */
        var emptyTag_1 = document.createElement('button');
        emptyTag_1.setAttribute('class', 'btn w-100 border border-2');
        emptyTag_1.innerText = '当前标签列表为空';
        elementGroup_1.div.tagList.append(emptyTag_1);
        elementGroup_1.button.addTag.addEventListener('click', function () {
            elementGroup_1.input.tag.focus();
            var tag = elementGroup_1.input.tag.value;
            if (tag.match(/^\s*$/))
                return;
            if (tagList_1.includes(tag))
                return;
            elementGroup_1.input.tag.value = '';
            var newTagEle = document.createElement('div');
            newTagEle.classList.add("list-group-item", "list-group-item-action", "list-group-item-success");
            newTagEle.innerHTML = tag;
            tagList_1.push(tag);
            elementGroup_1.div.tagList.append(newTagEle);
            emptyTag_1.remove();
            newTagEle.addEventListener('click', function () {
                newTagEle.remove();
                var index = tagList_1.indexOf(tag);
                tagList_1.splice(index, 1);
                if (tagList_1.length == 0)
                    elementGroup_1.div.tagList.append(emptyTag_1);
            });
        });
        elementGroup_1.input.tag.addEventListener('keyup', function (event) {
            if (event.key == 'Enter')
                elementGroup_1.button.addTag.click();
        });
        var reset_1 = function () {
            route.dom.querySelectorAll('input, textarea').forEach(function (ele) { return ele.value = ''; });
            elementGroup_1.div.tagList.innerHTML = '';
            elementGroup_1.div.tagList.append(emptyTag_1);
            tagList_1.splice(0, tagList_1.length);
        };
        elementGroup_1.button.reset.addEventListener('click', function () { return reset_1; });
        elementGroup_1.button.submit.addEventListener('click', function () {
            var url = elementGroup_1.input.url.value;
            var title = elementGroup_1.input.title.value;
            var text = elementGroup_1.textarea.text.value;
            if (url.match(/^\s*$/) && text.match(/^\s*$/)) {
                return alert('URL 和描述文本不能同时为空');
            }
            var xhr = new XMLHttpRequest();
            xhr.open('POST', config_1.apiConfig.add);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var params = new URLSearchParams();
            params.set('url', url);
            params.set('title', title);
            params.set('text', text);
            params.set('tagList', tagList_1.join('||'));
            xhr.send(params.toString());
            xhr.addEventListener('readystatechange', function () {
                if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
                    var res = JSON.parse(xhr.responseText);
                    alert(res.msg);
                    if (res.code == 200) {
                        return reset_1();
                    }
                }
            });
        });
    }
};
exports.add = add;
