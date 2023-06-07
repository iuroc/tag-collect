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
