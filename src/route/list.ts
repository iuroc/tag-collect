import { RouteEvent } from 'apee-router'
import { apiConfig } from '../config'
import { AjaxRes } from '../types'

/** `hash = #/list` */
export const list: RouteEvent = (route) => {
    if (route.status == 0) {
        route.status = 1
        const collectListEle = route.dom.querySelector('.collect-list') as HTMLDivElement
        const loadCollectList = (page: number = 0, pageSize: number = 36, keyword: string = '') => {
            if (page == 0) collectListEle.innerHTML = ''
            const xhr = new XMLHttpRequest()
            const params = new URLSearchParams()
            params.set('page', page.toString())
            params.set('pageSize', pageSize.toString())
            params.set('keyword', keyword)
            xhr.open('GET', `${apiConfig.collectList}?${params.toString()}`)
            xhr.send()
            xhr.addEventListener('readystatechange', () => {
                if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
                    const res = JSON.parse(xhr.responseText) as AjaxRes
                    if (res.code == 200) {
                        const list: CollectRow[] = res.data
                        let html = ''
                        list.forEach(item => {
                            html += `
                                <div class="col-md-6 col-xl-4 h-100 mb-4">
                                    <div class="card card-body border border-2 rounded-4 hover-shadow shadow-sm list-group-item-action">
                                        <div class="fs-5 fw-bold mb-2">${item.title}</div>
                                        <div class="text-muted small">${item.url}</div>
                                        <div class="text-muted">${item.text}</div>
                                    </div>
                                </div>`
                        })
                        collectListEle.innerHTML += html
                        return
                    }
                    alert(res.msg)
                }
            })
        }
        loadCollectList()
    }
}

/** 收藏记录 */
type CollectRow = {
    id: number,
    title: string,
    url: string,
    text: string,
    'update_time': string,
    'create_time': string,
}