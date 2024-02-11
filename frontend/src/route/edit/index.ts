import van from 'vanjs-core'
import { Route, activeRoute, routeTo } from 'vanjs-router'
import { sgGlobal } from '../../state'
import { selectTagModal, selectTagModalEle } from './view/modal'
import sg from './state'
import { clearDOM } from '../../util'
import { loadCollectInfo, saveAdd } from './mixin'
import { setupEditor } from './editor'

const { button, div, edit, input, label, textarea } = van.tags
const { svg, path } = van.tagsNS('http://www.w3.org/2000/svg')
/** 在 Add 页面的 Tag 元素，模态框中的 Tag 是 `TagInModal` 而不是这个 */
export const Tag = (text: string) => {
    return div({
        class: `tag-select-item primary-subtle hover`,
        onclick() {
            this.remove()
            tagInputEle.focus()
        }
    }, text)
}

/** 标签输入框 */
const tagInputEle = input({
    class: 'form-control form-control-sm d-inline-block', style: 'width: 150px;', placeholder: '回车插入，空格逗号分隔', onkeydown(event) {
        if (event.key == 'Enter') {
            const tagSelected = getTagsFromBox()
            const tags = (event.target.value as string).trim().split(/[\s,，]/)
            tags.forEach(tag => {
                if (!tagSelected.includes(tag) && tag) {
                    van.add(tagListBox, Tag(tag))
                }
            })
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

const titleInputElement = input({ type: 'text', class: 'form-control border-2', placeholder: '收藏描述', oninput: event => sg.get('title').val = event.target.value, value: sg.get('title') })

const editorEle = div()
export const editorView = setupEditor(editorEle)

export default () => {
    return Route({
        name: 'edit', onLoad({ args }) {
            if (!sgGlobal.get('hasLogin').val) routeTo('home')

            const getMode = () => {
                if (args.length == 0) return 'add'
                if (args[0] == 'select') return 'select'
                return 'update'
            }
            // 判断是否为编辑模式
            if (getMode() == 'update') {
                sg.set('mode', 'update')
                const collectId = parseInt(args[0])
                sg.get('id').val = collectId
                loadCollectInfo(collectId)
                setTimeout(() => {
                    titleInputElement.focus()
                })
            } else if (getMode() == 'add') {
                sg.set('mode', 'add')
                setTimeout(() => {
                    titleInputElement.focus()
                })
            }
            if (getMode() != 'select' && selectTagModalEle.style.display == 'block')
                selectTagModal.hide()
        },
        class: 'container py-4'
    },
        div({ class: 'hstack mb-4' },
            div({ class: 'fs-3 me-auto' }, '新增收藏'),
            button({ class: 'btn btn-primary', onclick: saveAdd }, svg({ fill: 'currentColor', class: 'bi bi-check-circle me-1 h-w-1em', viewBox: '0 0 16 16' },
                path({ 'd': 'M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' }),
                path({ 'd': 'm10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05' }),
            ), '确定保存')
        ),
        div({ class: 'row gy-3 mb-3' },
            div({ class: 'col-lg-6' },
                div({ class: 'form-floating' },
                    titleInputElement,
                    label('收藏标题')
                )
            ),
            div({ class: 'col-lg-6' },
                div({ class: 'form-floating' },
                    input({ type: 'url', class: 'form-control border-2', placeholder: '收藏网址', oninput: event => sg.get('url').val = event.target.value, value: sg.get('url') }),
                    label('收藏网址')
                )
            ),
            div({ class: 'col-lg-5 col-xl-4' },
                div({ class: 'card border-2', style: 'height: 200px;' },
                    div({ class: 'card-header hstack gap-2' },
                        div({ class: 'input-group' },
                            tagInputEle,
                            button({
                                class: 'btn btn-sm btn-success', async onclick() {
                                    selectTagModal.show()
                                }
                            },
                                svg({ fill: 'currentColor', class: 'bi bi-check2-circle me-1 h-w-1em', viewBox: '0 0 16 16' },
                                    path({ 'd': 'M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0' }),
                                    path({ 'd': 'M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z' }),
                                ), '选择'),
                            button({
                                class: 'btn btn-sm btn-danger', onclick() {
                                    clearDOM(tagListBox)
                                    tagInputEle.focus()
                                }
                            },
                                svg({ fill: 'currentColor', class: 'bi bi-x-circle me-1 h-w-1em', viewBox: '0 0 16 16' },
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
            div({ class: 'col-lg-7 col-xl-8' },
                div({ class: 'border border-3 rounded overflow-hidden' }, editorEle)
            ),
        )
    )
}

window.addEventListener('keydown', event => {
    if (activeRoute.val.name == 'edit' && event.key == 's' && event.ctrlKey) {
        event.preventDefault()
    }
})
window.addEventListener('keyup', event => {
    if (activeRoute.val.name == 'edit' && event.key == 's' && event.ctrlKey) {
        saveAdd()
    }
})