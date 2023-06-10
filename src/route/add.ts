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
                url: route.dom.querySelector('.input-url') as HTMLInputElement,
                title: route.dom.querySelector('.input-title') as HTMLInputElement,
                tag: route.dom.querySelector('.input-tag') as HTMLInputElement,
            },
            textarea: {
                text: route.dom.querySelector('.input-text') as HTMLTextAreaElement,
            },
            button: {
                getOrigin: route.dom.querySelector('.get-origin') as HTMLButtonElement,
                getTitle: route.dom.querySelector('.get-title') as HTMLButtonElement,
                submit: route.dom.querySelector('.submit') as HTMLButtonElement,
                reset: route.dom.querySelector('.reset') as HTMLButtonElement,
                addTag: route.dom.querySelector('.add-tag') as HTMLButtonElement
            },
            div: {
                tagList: route.dom.querySelector('.tag-list') as HTMLDivElement,
                searchResult: route.dom.querySelector('.search-result-list') as HTMLDivElement
            }
        }
        elementGroup.button.getOrigin.addEventListener('click', () => {
            const ele = elementGroup.input.url as HTMLInputElement
            ele.focus()
            try {
                ele.value = new URL(ele.value).origin
            } catch { }
        })
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

        elementGroup.input.url.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') elementGroup.button.getOrigin.click()
        })

        elementGroup.input.title.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') elementGroup.button.getTitle.click()
        })
        /** 标签列表为空时的提示元素 */
        const emptyTag = document.createElement('button')
        emptyTag.setAttribute('class', 'btn w-100 border border-2')
        emptyTag.innerText = '当前标签列表为空'
        elementGroup.div.tagList.append(emptyTag)
        elementGroup.button.addTag.addEventListener('click', () => {
            elementGroup.input.tag.focus()
            let tag = elementGroup.input.tag.value
            if (tag.match(/^\s*$/)) return
            if (tagList.includes(tag)) return
            elementGroup.input.tag.value = ''
            const newTagEle = document.createElement('div')
            newTagEle.classList.add("list-group-item", "list-group-item-action", "list-group-item-success")
            newTagEle.innerHTML = tag
            tagList.push(tag)
            elementGroup.div.tagList.append(newTagEle)
            emptyTag.remove()
            newTagEle.addEventListener('click', () => {
                newTagEle.remove()
                let index = tagList.indexOf(tag)
                tagList.splice(index, 1)
                if (tagList.length == 0) elementGroup.div.tagList.append(emptyTag)
            })
        })
        elementGroup.input.tag.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') elementGroup.button.addTag.click()
        })
        const reset = () => {
            route.dom.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea').forEach(ele => ele.value = '')
            elementGroup.div.tagList.innerHTML = ''
            elementGroup.div.tagList.append(emptyTag)
            tagList.splice(0, tagList.length)
        }
        elementGroup.button.reset.addEventListener('click', () => reset)
        elementGroup.button.submit.addEventListener('click', () => {
            let url = elementGroup.input.url.value
            let title = elementGroup.input.title.value
            let text = elementGroup.textarea.text.value
            if (url.match(/^\s*$/) && text.match(/^\s*$/)) {
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
                        return reset()
                    }
                }
            })
        })
    }
}