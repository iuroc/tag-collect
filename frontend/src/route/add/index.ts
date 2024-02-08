import van from 'vanjs-core'
import { Route, routeTo } from 'vanjs-router'
import sgGlobal from '../../state'

const { button, div, input, label, textarea } = van.tags

export default () => {

    return Route({
        name: 'add', onLoad() {
            if (!sgGlobal.get('hasLogin').val) routeTo('home')
        },
        class: 'container py-4'
    },
        div({ class: 'mb-4 fs-3' }, '新增收藏'),
        div({ class: 'row gy-3 mb-3' },
            div({ class: 'col-lg-6' },
                div({ class: 'form-floating' },
                    input({ type: 'text', class: 'form-control border-2', placeholder: '收藏描述' }),
                    label('收藏描述')
                )
            ),
            div({ class: 'col-lg-6' },
                div({ class: 'form-floating' },
                    input({ type: 'url', class: 'form-control border-2', placeholder: '收藏网址' }),
                    label('收藏网址')
                )
            ),
            div({ class: 'col-lg-6' },
                div({ class: 'form-floating' },
                    textarea({ class: 'form-control border-2', placeholder: '收藏备注', style: 'height: 200px;' }),
                    label('收藏备注（Markdown）')
                )
            ),
            div({ class: 'col-lg-6' },
                div({ class: 'card border-2', style: 'height: 200px;' },
                    div({ class: 'card-header hstack gap-2' }, '标签列表',
                        button({ class: 'btn btn-sm btn-outline-success ms-auto' }, '选择标签'),
                        button({ class: 'btn btn-sm btn-outline-danger' }, '清空选择')
                    ),
                    div({ class: 'card-body' },
                        div({ class: 'flex-wrap d-flex', style: 'gap: .3rem;' },
                            
                        )
                    )
                )
            )
        )
    )
}