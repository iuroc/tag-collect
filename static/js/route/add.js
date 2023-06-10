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
                /** 网址输入框 */
                url: route.dom.querySelector('.input-url'),
                /** 标题输入框 */
                title: route.dom.querySelector('.input-title'),
                /** 标签输入框 */
                tag: route.dom.querySelector('.input-tag'),
            },
            textarea: {
                /** 描述文本输入框 */
                text: route.dom.querySelector('.input-text'),
            },
            button: {
                /** 按钮：获取 Origin */
                getOrigin: route.dom.querySelector('.get-origin'),
                /** 按钮：根据 URL 获取标题 */
                getTitle: route.dom.querySelector('.get-title'),
                /** 按钮：点击提交 */
                submit: route.dom.querySelector('.submit'),
                /** 按钮：点击重置 */
                reset: route.dom.querySelector('.reset'),
                /** 按钮：点击增加标签 */
                addTag: route.dom.querySelector('.add-tag')
            },
            div: {
                /** 当前已经插入的标签列表 */
                tagList: route.dom.querySelector('.tag-list'),
                /** 标签搜索结果列表 */
                searchResult: route.dom.querySelector('.search-result-list')
            }
        };
        // 设置单击事件：单击获取 Origin
        elementGroup_1.button.getOrigin.addEventListener('click', function () {
            var ele = elementGroup_1.input.url;
            ele.focus();
            try {
                ele.value = new URL(ele.value).origin;
            }
            catch (_a) { }
        });
        // 设置单击事件：单击根据 URL 获取标题
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
        // URL 输入框回车获取 Origin
        elementGroup_1.input.url.addEventListener('keyup', function (event) {
            if (event.key == 'Enter')
                elementGroup_1.button.getOrigin.click();
        });
        // 标题输入框回车根据 URL 获取标题
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
            insertTag_1();
            changeTagList_1();
        });
        /**
         * 生成新的标签 DOM
         * @param tag 标签名称
         * @param color 颜色代码
         * @returns 标签 DOM
         */
        var makeNewTag_1 = function (tag, color) {
            var newTagEle = document.createElement('div');
            newTagEle.classList.add("list-group-item", "list-group-item-action", "list-group-item-" + color);
            newTagEle.innerHTML = tag;
            return newTagEle;
        };
        /**
         * 向标签列表中插入新的标签
         * @param tag 标签名称
         */
        var insertTag_1 = function (tag) {
            elementGroup_1.input.tag.focus();
            var tagValue = elementGroup_1.input.tag.value;
            elementGroup_1.input.tag.value = '';
            if (typeof tag == 'undefined')
                tag = tagValue;
            if (tag.match(/^\s*$/))
                return;
            if (tagList_1.includes(tag))
                return;
            var newTagEle = makeNewTag_1(tag, 'success');
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
        };
        /** 定时器，用于标签输入框触发标签搜索时的节流 */
        var tagEditTimer_1;
        /** 用于搜索标签的 XHR 对象 */
        var tagSearchXhr_1 = new XMLHttpRequest();
        // 标签搜索完成事件
        tagSearchXhr_1.addEventListener('readystatechange', function () {
            if (tagSearchXhr_1.status == 200 && tagSearchXhr_1.readyState == tagSearchXhr_1.DONE) {
                var res = JSON.parse(tagSearchXhr_1.responseText);
                if (res.code == 200) {
                    var result = res.data;
                    if (result.length == 0) {
                        changeTagList_1();
                    }
                    else {
                        elementGroup_1.div.searchResult.innerHTML = '';
                        result.forEach(function (tag) {
                            var newTagEle = makeNewTag_1('推荐：' + tag, 'light');
                            elementGroup_1.div.searchResult.append(newTagEle);
                            newTagEle.addEventListener('click', function () {
                                changeTagList_1();
                                insertTag_1(tag);
                            });
                        });
                        changeSearchResult_1();
                    }
                    return;
                }
                alert(res.msg);
            }
        });
        /** 切换到标签列表显示 */
        var changeTagList_1 = function () {
            elementGroup_1.div.searchResult.style.display = 'none';
            elementGroup_1.div.tagList.style.display = 'block';
        };
        /** 切换到标签搜索结果列表 */
        var changeSearchResult_1 = function () {
            elementGroup_1.div.searchResult.style.display = 'block';
            elementGroup_1.div.tagList.style.display = 'none';
        };
        // 标签输入框的按键按下事件
        elementGroup_1.input.tag.addEventListener('keyup', function (event) {
            // 每次按下按钮，清除之前的定时器，生成新的定时器
            clearTimeout(tagEditTimer_1);
            // 回车时，插入新标签
            if (event.key == 'Enter')
                return elementGroup_1.button.addTag.click();
            /** 标签输入框的值 */
            var value = elementGroup_1.input.tag.value;
            // 输入框内容为空，立刻切换到标签列表
            if (value.length == 0)
                return changeTagList_1();
            tagEditTimer_1 = setTimeout(function () {
                tagSearchXhr_1.abort();
                tagSearchXhr_1.open('GET', "".concat(config_1.apiConfig.tagList, "?keyword=").concat(value));
                tagSearchXhr_1.send();
            }, 200);
        });
        /** 重置表单 */
        var reset_1 = function () {
            route.dom.querySelectorAll('input, textarea').forEach(function (ele) { return ele.value = ''; });
            elementGroup_1.div.tagList.innerHTML = '';
            elementGroup_1.div.tagList.append(emptyTag_1);
            tagList_1.splice(0, tagList_1.length);
        };
        // 设置点击重置表单事件
        elementGroup_1.button.reset.addEventListener('click', function () { return reset_1; });
        // 设置点击提交事件
        elementGroup_1.button.submit.addEventListener('click', function () {
            var url = elementGroup_1.input.url.value;
            var title = elementGroup_1.input.title.value;
            var text = elementGroup_1.textarea.text.value;
            if (!!url.match(/^\s*$/) && !!text.match(/^\s*$/)) {
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
                        // 操作完成，重置表单
                        return reset_1();
                    }
                }
            });
        });
    }
};
exports.add = add;
