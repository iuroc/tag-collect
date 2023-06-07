import { Route, RouteEvent } from 'apee-router'
import { apiConfig } from '../config'

/** `hash = #/tag` */
const routeEvent: RouteEvent = (route, router) => {
    if (route.args[0] == 'call' && router.hashChanged) {
        // 用作回调的标签选择器

    } else {

    }
    loadTagList(route)
}

/** 加载标签列表 */
function loadTagList(route: Route) {
    const xhr = new XMLHttpRequest()
    /** 全部标签的容器 */
    const tagListDom = route.dom.querySelector('.tag-list') as HTMLDivElement
    /** 最近使用的标签列表容器 */
    const recentTagListDom = route.dom.querySelector('.recent-tag-list') as HTMLDivElement
    const searchBox = route.dom.querySelector('.search-box') as HTMLDivElement
    // 页面载入，将已选中的标签列表记录清空
    route.data.tagSelectedList = []
    tagListDom.innerHTML = recentTagListDom.innerHTML = ''
    /** 路由存储区数据：当前页面被选中的标签列表 */
    const tagSelectedList: string[] = route.data.tagSelectedList
    xhr.open('GET', apiConfig.getTag)
    xhr.send()
    xhr.onreadystatechange = () => {
        if (xhr.status == 200 && xhr.readyState == 4) {
            const res = JSON.parse(xhr.responseText)
            if (res.code == 200) {
                if (Object.keys(res.data).length == 0) {
                    searchBox.classList.add('d-none')
                    tagListDom.innerHTML = '<div class="lead">标签列表为空，快去添加收藏吧</div>'
                    return
                }
                searchBox.classList.remove('d-none')
                /** 最近使用的标签列表 */
                const recentTag = res.data.recent as string[]
                /** 完整标签列表 */
                const allTag = res.data.all as [string, number][]
                // 载入最近使用标签列表
                recentTagListDom.innerHTML = ''
                recentTag.forEach(tag => {
                    addNewTag(tag, null, recentTagListDom, recentTag, route)
                })
                // 载入所有标签列表
                tagListDom.innerHTML = ''
                allTag.forEach((row) => {
                    let [tag, num] = row
                    addNewTag(tag, num, tagListDom, recentTag, route)
                })
                return
            }
            alert(res.msg)

        }

    }
}


/**
 * 增加一个标签元素
 * @param tagName 标签名称
 * @param count 标签的使用次数
 * @param listDom 需要将标签插入到哪个列表 DOM
 * @param markList 需要被标记的标签列表，使用 `data-mark-index` 标记
 * @param route 当前路由对象
 */
function addNewTag(
    tagName: string,
    count: number | null,
    listDom: HTMLDivElement,
    markList: [string, number][] | string[],
    route: Route
) {
    /** 新标签元素 */
    const newTag = document.createElement('button')
    /** 标签元素中的【标签文本】元素 */
    // const tagText = makeTagText(tagName)
    newTag.innerText = tagName
    newTag.setAttribute('class', 'btn border border-2 mb-3 mx-1 shadow-sm')
    // newTag.append(tagText)
    let badgeSpan: HTMLSpanElement | undefined
    if (count != null) {
        /** 标签元素中的【标签使用次数】文本元素 */
        badgeSpan = makeBadgeSpan(count)
        newTag.append(badgeSpan)
    }
    let index = getMarkIndex(tagName, markList)
    if (index > -1)
        newTag.setAttribute('data-mark-index', index.toString())
    listDom.append(newTag)
    newTag.addEventListener('click', () => {
        let market = newTag.getAttribute('data-mark-index')
        if (market != null) {
            route.dom.querySelectorAll<HTMLButtonElement>(`[data-mark-index="${market}"]`).forEach(ele => {
                click(ele, ele.querySelector('.badge') as HTMLSpanElement)
            })
        } else {
            click(newTag, badgeSpan)
        }
    })
}

function click(tagDom: HTMLButtonElement, badgeSpan?: HTMLSpanElement) {
    /** 被选中的标签需要增加的类 */
    let selectedClass = ['border-primary', 'text-primary']
    if (tagDom.classList.contains('text-primary')) {
        // 取消选中
        tagDom.classList.remove(...selectedClass)
        badgeSpan?.classList.remove('bg-primary', 'border-primary')
        badgeSpan?.classList.add('text-bg-light')
    } else {
        // 选中
        tagDom.classList.add(...selectedClass)
        badgeSpan?.classList.remove('text-bg-light')
        badgeSpan?.classList.add('bg-primary', 'border-primary')
    }
}

function makeBadgeSpan(count: number) {
    const badgeSpan = document.createElement('span')
    badgeSpan.classList.add('badge', 'text-bg-light', 'border', 'ms-2')
    badgeSpan.innerText = count.toString()
    return badgeSpan
}


/** 获取标签名称在被标记标签列表中的下标，如果没有找到，将返回 `-1` */
function getMarkIndex(tagName: string, markList: [string, number][] | string[]) {
    for (let i = 0; i < markList.length; i++) {
        const item = markList[i]
        let markName = typeof item == 'string' ? item : item[0]
        if (markName == tagName)
            return i
    }
    return -1
}

export default routeEvent