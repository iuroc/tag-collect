import van from 'vanjs-core'
import { Route, activeRoute, routeTo } from 'vanjs-router'
import { ListItem } from '../work/view'
import sgWork from '../work/state'
import { collectInfoModal, collectInfoModalEle } from '../work/view/modal'
import { sgGlobal } from '../../state'
import { clickSearch } from './mixin'
import sg from './state'
import sgEdit from '../edit/state'
import { fetchCollectList } from '../work/mixin'
import { selectTagModal, selectTagModalEle } from '../edit/view/modal'

const { button, div, input, span } = van.tags
const { svg, path } = van.tagsNS('http://www.w3.org/2000/svg')

const SearchTip = () => div({ hidden: sg.get('hideSearchTip') },
    div({ class: 'fw-bold hstack gap-2 mb-3' }, '可搜索',
        span({ class: 'tag-select-item border-primary-subtle text-primary-emphasis' }, '标题'),
        span({ class: 'tag-select-item border-success-subtle text-success-emphasis' }, '网址'),
        span({ class: 'tag-select-item border-danger-subtle text-danger-emphasis' }, '描述'),
        span({ class: 'tag-select-item border-info-subtle text-info-emphasis' }, '标签'),
    ),
    div({ class: 'mb-3' },
        svg({ fill: 'currentColor', class: 'bi bi-lightbulb h-w-1em me-2', viewBox: '0 0 16 16' },
            path({ 'd': 'M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z' }),
        ), '使用空格分隔关键词，可模糊搜索'),
)

const NoResult = () => div({ class: 'fs-5', hidden: sg.get('hideNoResultTip') },
    svg({ fill: 'currentColor', class: 'bi bi-bug h-w-1em me-2', viewBox: '0 0 16 16' },
        path({ 'd': 'M4.355.522a.5.5 0 0 1 .623.333l.291.956A4.979 4.979 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A4.985 4.985 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623zM4 7v4a4 4 0 0 0 3.5 3.97V7H4zm4.5 0v7.97A4 4 0 0 0 12 11V7H8.5zM12 6a3.989 3.989 0 0 0-1.334-2.982A3.983 3.983 0 0 0 8 2a3.983 3.983 0 0 0-2.667 1.018A3.989 3.989 0 0 0 4 6h8z' }),
    ), '暂无搜索结果')

export const searchResultListEle = div({ class: 'row gy-4' })
export const searchInputEle = input({ class: 'form-control', onkeyup: event => clickSearch(event), oninput: event => sg.get('keyword').val = event.target.value, value: sg.get('keyword'), placeholder: '请输入搜索关键词' })

export default () => Route({
    name: 'search', onLoad({ args }) {
        if (!sgGlobal.get('hasLogin').val) return routeTo('home')
        sgWork.obj('modal').set('fromRoute', 'search')
        if (args.length == 0 && collectInfoModalEle.style.display == 'block')
            collectInfoModal.hide()
        if (args.length == 0 && collectInfoModalEle.style.display.replace('none', '') == '') {
            setTimeout(() => { searchInputEle.focus() })
        }
        if (args.length == 0 && selectTagModalEle.style.display == 'block') {
            selectTagModal.hide()
        }
    }, class: 'container py-4'
},
    div({ class: 'hstack gap-2 mb-4', style: 'max-width: 600px;' },
        div({ class: 'input-group' },
            searchInputEle,
            button({
                class: 'btn btn-success', onclick: event => clickSearch(event)
            }, '搜索'),
            button({
                class: 'btn btn-primary', onclick() {
                    sgEdit.obj('modal').set('fromRoute', 'search')
                    selectTagModal.show()
                }
            }, '标签')
        ),
    ),
    SearchTip(),
    NoResult(),
    searchResultListEle
)

window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 20) {
        if (activeRoute.val.name != 'search') return
        if (sg.get('loadingLock')) return
        sg.set('loadingLock', true)
        fetchCollectList(sg.get('nextPage') + 1, sg.get('pageSize'), sg.get('keyword').val).then(data => {
            if (data.list.length > 0) {
                data.list.map(item => {
                    van.add(searchResultListEle, ListItem(item))
                })
                sg.set('nextPage', sg.get('nextPage') + 1)
                setTimeout(() => {
                    sg.set('loadingLock', data.end)
                }, 500)
            }
        })
    }
})