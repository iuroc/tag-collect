import van from 'vanjs-core'
import { Route, routeTo } from 'vanjs-router'
import { ListItem } from '../work/view'
import sgWork from '../work/state'
import { collectInfoModal, collectInfoModalEle } from '../work/view/modal'
import { sgGlobal } from '../../state'

const { button, div, input } = van.tags

export default () => Route({
    name: 'search', onLoad({ args }) {
        if (!sgGlobal.get('hasLogin').val) return routeTo('home')
        sgWork.obj('modal').set('fromRoute', 'search')
        if (args.length == 0 && collectInfoModalEle.style.display == 'block')
            collectInfoModal.hide()
    }, class: 'container py-4'
},
    div({ class: 'hstack gap-2 mb-4', style: 'max-width: 600px;' },
        div({ class: 'input-group' },
            input({ class: 'form-control', placeholder: '请输入搜索关键词' }),
            button({ class: 'btn btn-success' }, '搜索'),
            button({ class: 'btn btn-primary' }, '标签')
        ),
    ),
    div({ class: 'row gy-4' },
        ListItem({
            title: '标题',
            url: 'https://www.baidu.com',
            tags: ['标签1', '标签2'],
            desc: '描述',
            'create_time': '2021-01-01 12:00:00',
            id: 5
        })
    )
)