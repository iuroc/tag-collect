import { Route, routeTo } from 'vanjs-router'
import { sgGlobal } from '../../state'
import van from 'vanjs-core'
import { ListItem } from './view'
import { fetchCollectList, firstLoadCollectList } from './mixin'
import sg from './state'

const { button, div } = van.tags
const { svg, path } = van.tagsNS('http://www.w3.org/2000/svg')

export const collectListEle = div({ class: 'row gy-4' })

export default () => Route({
    name: 'work', onLoad() {
        if (!sgGlobal.get('hasLogin').val) return routeTo('home')
        firstLoadCollectList()
    }, class: 'container py-4'
},
    div({ class: 'mb-4 hstack gap-3' },
        button({ class: 'btn btn-primary', onclick: () => routeTo('add') },
            svg({ fill: 'currentColor', class: 'bi bi-plus-square me-1 h-w-1em', viewBox: '0 0 16 16' },
                path({ 'd': 'M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z' }),
                path({ 'd': 'M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4' }),
            ), '新增收藏'),
        button({ class: 'btn btn-success', onclick: () => routeTo('search') },
            svg({ fill: 'currentColor', class: 'bi bi-search me-1 h-w-1em', viewBox: '0 0 16 16' },
                path({ 'd': 'M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0' }),
            ), '记录搜索'),
    ),
    collectListEle
)

window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 20) {
        if (sg.get('loadingLock')) return
        sg.set('loadingLock', true)
        fetchCollectList(sg.get('nextPage') + 1).then(data => {
            if (data.list.length > 0) {
                data.list.map(item => {
                    van.add(collectListEle, ListItem(item))
                })
                sg.set('nextPage', sg.get('nextPage') + 1)
                setTimeout(() => {
                    sg.set('loadingLock', data.list.length != data.pageSize)
                }, 500)
            }
        })
    }
})