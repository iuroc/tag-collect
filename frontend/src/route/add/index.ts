import van from 'vanjs-core'
import { Route, routeTo } from 'vanjs-router'
import sgGlobal from '../../state'
import { selectTagModal } from './view/modal'
import { fetchTags } from './mixin'

const { button, div, input, label, textarea } = van.tags
const { svg, path } = van.tagsNS('http://www.w3.org/2000/svg')

const Tag = (text: string) => {
    return div({
        class: `tag-select-item bg-secondary-subtle text-secondary-emphasis rounded-1 d-inline-block small user-select-none py-1 px-2`,
        onclick() {
            this.remove()
            tagInputEle.focus()
        }
    }, text)
}

/** 标签输入框 */
const tagInputEle = input({
    class: 'form-control form-control-sm d-inline-block', style: 'width: 150px;', placeholder: '输入标签，回车插入', onkeydown(event) {
        if (event.key == 'Enter') {
            const tagSelected = getTagsFromBox()
            if (!tagSelected.includes(event.target.value) && event.target.value) {
                tagListBox.appendChild(Tag(event.target.value))
            }
            event.target.value = ''
        }
    }
})

/** 已经被载入到 `tagListBox` 的标签列表 */
export let getTagsFromBox = () => {
    const tags: string[] = []
    for (const tag of tagListBox.children) {
        tags.push((tag as HTMLDivElement).innerText)
    }
    return tags
}
/** 用于显示标签列表的 DOM 盒子 */
export const tagListBox = div({ class: 'hstack flex-wrap gap-2' })

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
                div({ class: 'card border-2', style: 'height: 200px;' },
                    div({ class: 'card-header hstack gap-2' },
                        div({ class: 'input-group' },
                            tagInputEle,
                            button({
                                class: 'btn btn-sm btn-outline-success', async onclick() {
                                    selectTagModal.show()
                                }
                            },
                                svg({ fill: 'currentColor', class: 'bi bi-check2-circle me-1', style: 'height: 1em;', viewBox: '0 0 16 16' },
                                    path({ 'd': 'M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0' }),
                                    path({ 'd': 'M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z' }),
                                ), '选择'),
                            button({
                                class: 'btn btn-sm btn-outline-danger', onclick() {
                                    tagListBox.innerHTML = ''
                                    tagInputEle.focus()
                                }
                            },
                                svg({ fill: 'currentColor', class: 'bi bi-x-circle me-1', style: 'height: 1em;', viewBox: '0 0 16 16' },
                                    path({ 'd': 'M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' }),
                                    path({ 'd': 'M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708' }),
                                ), '清空'),
                        )
                    ),
                    div({ class: 'card-body overflow-auto' },
                        tagListBox,
                    )
                )
            ),
            div({ class: 'col-lg-6' },
                div({ class: 'form-floating' },
                    textarea({ class: 'form-control border-2', placeholder: '收藏备注', style: 'height: 200px;' }),
                    label('收藏备注（Markdown）')
                )
            ),
        )
    )
}