"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var config_1 = require("../config");
/** `hash = #/add` */
var routeEvent = function (route) {
    /** 网址输入框 */
    var urlInput = route.dom.querySelector('.input-url');
    /** 标题输入框 */
    var titleInput = route.dom.querySelector('.input-title');
    /** 标签输入框 */
    var tagInput = route.dom.querySelector('.input-tag');
    /** 描述文本输入框 */
    var textInput = route.dom.querySelector('.input-text');
    /** 点击提取根地址 */
    var getOrigin = route.dom.querySelector('.get-origin');
    /** 自动抓取 `title` */
    var getTitle = route.dom.querySelector('.get-title');
    /** 提交收藏 */
    var submit = route.dom.querySelector('.submit');
    /** 添加标签 */
    var addTag = route.dom.querySelector('.add-tag');
    /** 选择标签 */
    var selectTag = route.dom.querySelector('.select-tag');
    /** 生成标签 */
    var generateTag = route.dom.querySelector('.generate-tag');
    /** 标签列表 DOM */
    var tagListEle = route.dom.querySelector('.tag-list');
    /** 重置表单按钮 */
    var resetBtn = route.dom.querySelector('.reset');
    urlInput.focus();
    if (route.status == 0) {
        route.status = 1;
        /** 正在显示的标签列表 */
        var tagList_1 = [];
        /** 获取 URL 根地址 */
        var getOriginListener_1 = function () {
            urlInput.focus();
            try {
                urlInput.value = new URL(urlInput.value).origin;
            }
            catch (_a) { }
        };
        /** 获取标题 */
        var getTitleListener_1 = function () {
            try {
                new URL(urlInput.value);
            }
            catch (_a) {
                return alert('你输入的 URL 不合法');
            }
            getTitle.setAttribute('disabled', 'disabled');
            var oldText = getTitle.innerText;
            getTitle.innerText = '正在抓取';
            /** 按钮复位 */
            function back() {
                getTitle.removeAttribute('disabled');
                getTitle.innerHTML = oldText;
            }
            (0, util_1.getTitleByUrl)(urlInput.value).then(function (title) {
                back(), titleInput.value = title;
            }).catch(function () {
                back(), alert('获取失败');
            });
        };
        /** 重置表单 */
        var reset_1 = function () {
            route.dom.querySelectorAll('input, textarea').forEach(function (ele) { return ele.value = ''; });
            tagListEle.innerHTML = '';
            tagListEle.append(emptyTag_1);
            tagList_1.splice(0, tagList_1.length);
        };
        /** 选择标签 */
        var selectTagListener = function () {
            location.hash = '/tag/call';
        };
        /** 生成标签 */
        var generateTagListener = function () {
        };
        /** 标签列表为空时显示的元素 */
        var emptyTag_1 = document.createElement('button');
        emptyTag_1.setAttribute('class', 'btn mb-3 w-100 border border-2');
        emptyTag_1.innerText = '当前标签列表为空';
        tagListEle.append(emptyTag_1);
        /** 添加标签 */
        var addTagListener_1 = function () {
            tagInput.focus();
            var tagName = tagInput.value;
            tagInput.value = '';
            if (tagName.match(/^\s*$/))
                return;
            // 判断当前标签是否存在显示列表中
            if (tagList_1.includes(tagName))
                return;
            /** 新的标签元素 */
            var newTag = document.createElement('button');
            newTag.setAttribute('class', 'btn border-primary text-primary shadow-sm border border-2 me-2 mb-3');
            newTag.innerText = tagName;
            newTag.addEventListener('click', function () {
                // 获取当前点击的元素的下标
                var index = tagList_1.indexOf(tagName);
                // 从 tagList 数组中删除该标签
                tagList_1.splice(index, 1);
                // 移除这个标签元素
                newTag.remove();
                // 移除标签后，标签列表为空，则显示空提示
                if (tagList_1.length == 0)
                    tagListEle.append(emptyTag_1);
                tagInput.focus();
            });
            // 如果添加标签前，标签列表为空，则先移除空提示
            if (tagList_1.length == 0)
                emptyTag_1.remove();
            // 将新的标签元素加入到标签列表显示中
            tagListEle.append(newTag);
            // 将新标签名称加入到 tagList 数组
            tagList_1.push(tagName);
        };
        getOrigin.addEventListener('click', getOriginListener_1);
        urlInput.addEventListener('keyup', function (event) {
            if (event.key == 'Enter')
                getOriginListener_1();
        });
        getTitle.addEventListener('click', getTitleListener_1);
        titleInput.addEventListener('keyup', function (event) {
            if (event.key == 'Enter')
                getTitleListener_1();
        });
        addTag.addEventListener('click', addTagListener_1);
        tagInput.addEventListener('keyup', function (event) {
            if (event.key == 'Enter')
                addTagListener_1();
        });
        submit.addEventListener('click', function () {
            var url = urlInput.value;
            var title = titleInput.value;
            var text = textInput.value;
            var tags = tagList_1;
            if (url.match(/^\s*$/) && text.match(/^\s*$/))
                return alert('URL 和描述文本不能同时为空');
            var xhr = new XMLHttpRequest();
            xhr.open('POST', config_1.apiConfig.add);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            xhr.send(JSON.stringify({ url: url, title: title, text: text, tags: tags }));
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var res = JSON.parse(xhr.responseText);
                    var code = res.code;
                    if (code == 200)
                        reset_1();
                    alert(res.msg);
                }
            };
        });
        resetBtn.addEventListener('click', reset_1);
        selectTag.addEventListener('click', selectTagListener);
        generateTag.addEventListener('click', generateTagListener);
    }
};
exports.default = routeEvent;
