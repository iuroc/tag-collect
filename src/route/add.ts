import { RouteEvent } from 'apee-router'
import { checkUrl } from '../util'
import { apiConfig } from '../config'
import { AjaxRes } from '../types'

/** `hash = #/add` */
export const add: RouteEvent = (route) => {
    if (route.status == 0) {
        route.status = 1
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
                tagList: route.dom.querySelector('.tag-list') as HTMLDivElement
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
            getTitle(elementGroup)
        })
        elementGroup.button.addTag.addEventListener('click', () => {
            
        })
    }
}


function getTitle(eleGroup: {
    button: Record<string, HTMLButtonElement>,
    input: Record<string, HTMLInputElement>,
}) {
    let url = eleGroup.input.url.value
    if (!checkUrl(url)) return alert('输入的 URL 不合法')
    eleGroup.button.getTitle.setAttribute('disabled', 'disabled')
    eleGroup.button.getTitle.innerHTML = '正在抓取'
    const xhr = new XMLHttpRequest()
    xhr.open('GET', apiConfig.getTitle + encodeURIComponent(url))
    xhr.timeout = 5000
    xhr.send()
    const endStatus = () => {
        eleGroup.button.getTitle.removeAttribute('disabled')
        eleGroup.button.getTitle.innerHTML = '自动抓取'
    }
    xhr.addEventListener('readystatechange', () => {
        if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
            const res = JSON.parse(xhr.responseText) as AjaxRes
            endStatus()
            if (res.code == 200) {
                eleGroup.input.title.value = res.data
                return
            }
            alert(res.msg)
        }
    })
    xhr.onerror = xhr.ontimeout = endStatus
}
