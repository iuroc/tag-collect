import { RouteEvent } from 'apee-router'
import { checkUrl } from '../util'
import { apiConfig } from '../config'
import { AjaxRes } from '../types'

/** `hash = #/add` */
export const add: RouteEvent = (route) => {
    if (route.status == 0) {
        route.status = 1
        /** 标签列表 */
        const tagList: string[] = []
        const elementGroup = {
            input: {
                /** 网址输入框 */
                url: route.dom.querySelector('.input-url') as HTMLInputElement,
                /** 标题输入框 */
                title: route.dom.querySelector('.input-title') as HTMLInputElement,
                /** 标签输入框 */
                tag: route.dom.querySelector('.input-tag') as HTMLInputElement,
            },
            textarea: {
                /** 描述文本输入框 */
                text: route.dom.querySelector('.input-text') as HTMLTextAreaElement,
            },
            button: {
                /** 按钮：获取 Origin */
                getOrigin: route.dom.querySelector('.get-origin') as HTMLButtonElement,
                /** 按钮：根据 URL 获取标题 */
                getTitle: route.dom.querySelector('.get-title') as HTMLButtonElement,
                /** 按钮：点击提交 */
                submit: route.dom.querySelector('.submit') as HTMLButtonElement,
                /** 按钮：点击重置 */
                reset: route.dom.querySelector('.reset') as HTMLButtonElement,
                /** 按钮：点击增加标签 */
                addTag: route.dom.querySelector('.add-tag') as HTMLButtonElement
            },
            div: {
                /** 当前已经插入的标签列表 */
                tagList: route.dom.querySelector('.tag-list') as HTMLDivElement,
                /** 标签搜索结果列表 */
                searchResult: route.dom.querySelector('.search-result-list') as HTMLDivElement
            }
        }
        // 设置单击事件：单击获取 Origin
        elementGroup.button.getOrigin.addEventListener('click', () => {
            const ele = elementGroup.input.url as HTMLInputElement
            ele.focus()
            try {
                ele.value = new URL(ele.value).origin
            } catch { }
        })
        // 设置单击事件：单击根据 URL 获取标题
        elementGroup.button.getTitle.addEventListener('click', () => {
            let url = elementGroup.input.url.value
            if (!checkUrl(url)) return alert('输入的 URL 不合法')
            elementGroup.button.getTitle.setAttribute('disabled', 'disabled')
            elementGroup.button.getTitle.innerHTML = '正在抓取'
            const xhr = new XMLHttpRequest()
            xhr.open('GET', apiConfig.getTitle + encodeURIComponent(url))
            xhr.timeout = 5000
            xhr.send()
            const endStatus = () => {
                elementGroup.button.getTitle.removeAttribute('disabled')
                elementGroup.button.getTitle.innerHTML = '自动抓取'
            }
            xhr.addEventListener('readystatechange', () => {
                if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
                    const res = JSON.parse(xhr.responseText) as AjaxRes
                    endStatus()
                    if (res.code == 200) {
                        elementGroup.input.title.value = res.data
                        return
                    }
                    alert(res.msg)
                }
            })
            xhr.onerror = xhr.ontimeout = endStatus
        })
        // URL 输入框回车获取 Origin
        elementGroup.input.url.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') elementGroup.button.getOrigin.click()
        })

        // 标题输入框回车根据 URL 获取标题
        elementGroup.input.title.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') elementGroup.button.getTitle.click()
        })


        /** 标签列表为空时的提示元素 */
        const emptyTag = document.createElement('button')
        emptyTag.setAttribute('class', 'btn w-100 border border-2')
        emptyTag.innerText = '当前标签列表为空'
        elementGroup.div.tagList.append(emptyTag)
        elementGroup.button.addTag.addEventListener('click', () => {
            insertTag()
            changeTagList()
        })


        /**
         * 生成新的标签 DOM
         * @param tag 标签名称
         * @param color 颜色代码
         * @returns 标签 DOM
         */
        const makeNewTag = (tag: string, color: string) => {
            const newTagEle = document.createElement('div')
            newTagEle.classList.add("list-group-item", "list-group-item-action", "list-group-item-" + color)
            newTagEle.innerHTML = tag
            return newTagEle
        }
        /**
         * 向标签列表中插入新的标签
         * @param tag 标签名称
         */
        const insertTag = (tag?: string) => {
            elementGroup.input.tag.focus()
            let tagValue = elementGroup.input.tag.value
            elementGroup.input.tag.value = ''
            if (typeof tag == 'undefined')
                tag = tagValue
            if (tag.match(/^\s*$/)) return
            if (tagList.includes(tag)) return
            const newTagEle = makeNewTag(tag, 'success')
            tagList.push(tag)
            elementGroup.div.tagList.append(newTagEle)
            emptyTag.remove()
            newTagEle.addEventListener('click', () => {
                newTagEle.remove()
                let index = tagList.indexOf(tag as string)
                tagList.splice(index, 1)
                if (tagList.length == 0) elementGroup.div.tagList.append(emptyTag)
            })
        }

        /** 定时器，用于标签输入框触发标签搜索时的节流 */
        let tagEditTimer: NodeJS.Timeout
        /** 用于搜索标签的 XHR 对象 */
        const tagSearchXhr = new XMLHttpRequest()
        // 标签搜索完成事件
        tagSearchXhr.addEventListener('readystatechange', () => {
            if (tagSearchXhr.status == 200 && tagSearchXhr.readyState == tagSearchXhr.DONE) {
                const res = JSON.parse(tagSearchXhr.responseText)
                if (res.code == 200) {
                    const result = res.data as string[]
                    if (result.length == 0) {
                        changeTagList()
                    } else {
                        elementGroup.div.searchResult.innerHTML = ''
                        result.forEach(tag => {
                            const newTagEle = makeNewTag('推荐：' + tag, 'light')
                            elementGroup.div.searchResult.append(newTagEle)
                            newTagEle.addEventListener('click', () => {
                                changeTagList()
                                insertTag(tag)
                            })
                        })
                        changeSearchResult()
                    }
                    return
                }
                alert(res.msg)
            }
        })

        /** 切换到标签列表显示 */
        const changeTagList = () => {
            elementGroup.div.searchResult.style.display = 'none'
            elementGroup.div.tagList.style.display = 'block'
        }

        /** 切换到标签搜索结果列表 */
        const changeSearchResult = () => {
            elementGroup.div.searchResult.style.display = 'block'
            elementGroup.div.tagList.style.display = 'none'
        }

        // 标签输入框的按键按下事件
        elementGroup.input.tag.addEventListener('keyup', (event) => {
            // 每次按下按钮，清除之前的定时器，生成新的定时器
            clearTimeout(tagEditTimer)
            // 回车时，插入新标签
            if (event.key == 'Enter')
                return elementGroup.button.addTag.click()
            /** 标签输入框的值 */
            let value = elementGroup.input.tag.value
            // 输入框内容为空，立刻切换到标签列表
            if (value.length == 0) return changeTagList()

            tagEditTimer = setTimeout(() => {
                tagSearchXhr.abort()
                tagSearchXhr.open('GET', `${apiConfig.tagList}?keyword=${value}`)
                tagSearchXhr.send()
            }, 200)
        })
        /** 重置表单 */
        const reset = () => {
            route.dom.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea').forEach(ele => ele.value = '')
            elementGroup.div.tagList.innerHTML = ''
            elementGroup.div.tagList.append(emptyTag)
            tagList.splice(0, tagList.length)
        }

        // 设置点击重置表单事件
        elementGroup.button.reset.addEventListener('click', () => reset)
        // 设置点击提交事件
        elementGroup.button.submit.addEventListener('click', () => {
            let url = elementGroup.input.url.value
            let title = elementGroup.input.title.value
            let text = elementGroup.textarea.text.value
            if (!!url.match(/^\s*$/) && !!text.match(/^\s*$/)) {
                return alert('URL 和描述文本不能同时为空')
            }

            const xhr = new XMLHttpRequest()
            xhr.open('POST', apiConfig.add)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            const params = new URLSearchParams()
            params.set('url', url)
            params.set('title', title)
            params.set('text', text)
            params.set('tagList', tagList.join('||'))
            xhr.send(params.toString())
            xhr.addEventListener('readystatechange', () => {
                if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
                    const res = JSON.parse(xhr.responseText) as AjaxRes
                    alert(res.msg)
                    if (res.code == 200) {
                        // 操作完成，重置表单
                        return reset()
                    }
                }
            })
        })
    }
}
