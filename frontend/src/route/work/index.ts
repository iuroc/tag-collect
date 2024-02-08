import { Route, routeTo } from 'vanjs-router'
import sgGlobal from '../../state'
import van from 'vanjs-core'
import { ListItem } from './view'

const { button, div } = van.tags
const { svg, path } = van.tagsNS('http://www.w3.org/2000/svg')

export default () => Route({
    name: 'work', onLoad() {
        if (!sgGlobal.get('hasLogin').val) routeTo('home')
    }, class: 'container py-4'
},
    div({ class: 'mb-4 hstack gap-3' },
        button({ class: 'btn btn-primary', onclick: () => routeTo('add') },
            svg({ fill: 'currentColor', style: 'height: 1em;', class: 'bi bi-plus-square me-1', viewBox: '0 0 16 16' },
                path({ 'd': 'M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z' }),
                path({ 'd': 'M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4' }),
            ), '新增收藏'),
        button({ class: 'btn btn-success', onclick: () => routeTo('search') },
            svg({ fill: "currentColor", class: "bi bi-search me-1", style: 'height: 1em;', viewBox: "0 0 16 16" },
                path({ "d": "M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" }),
            ), '记录搜索'),
    ),
    div({ class: 'row gy-4' },
        ListItem({
            title: '百度一下，你就知道',
            url: 'https://www.baidu.com/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            tags: ['搜索引擎', '搜索引擎', '工具', '工具', '工具', '搜索引擎', '搜索引擎', '工具', '搜索引擎', '工具',],
            desc: '百度是中国最大的搜索引擎和互联网公司之一，提供搜索、贴吧、知道等服务。其主页简洁明了，用户友好，提供快速搜索和导航功能。百度搜索引擎覆盖广泛，包括网页、图片、视频等多种类型的搜索，为用户提供全面的信息检索服务。百度还拥有丰富的互联网生态系统，涵盖在线地图、移动应用、云计算等领域。'
        }),
    )
)