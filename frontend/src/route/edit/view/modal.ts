import van, { ChildDom, State, Val } from 'vanjs-core'
import { Modal } from 'bootstrap'
import { fetchTags } from '../mixin'
import { Tag, getTagsFromBox, tagListBox } from '..'

const { button, div, input } = van.tags

export const MyModal = (init: {
    title: Val<string>,
    content: ChildDom,
    footer: ChildDom,
    noFade?: boolean,
    static?: boolean,
    keyboard?: boolean,
    noParentTag?: boolean,
    noFullSm?: boolean,
    size?: string
}) => {

    return div({
        class: `modal ${init.noFade ? '' : 'fade'}`,
        ...(init.static ? { 'data-bs-backdrop': init.static } : {}),
        ...(init.keyboard ? { 'data-bs-keyboard': init.keyboard } : {}),
        tabindex: -1
    },
        div({ class: `modal-dialog modal-${init.size || 'md'} modal-dialog-scrollable ${init.noFullSm ? '' : 'modal-fullscreen-sm-down'}` },
            div({ class: 'modal-content' },
                div({ class: 'modal-header' },
                    div({ class: 'h5 modal-title' }, init.title),
                    button({ class: 'btn-close', 'data-bs-dismiss': 'modal' })
                ),
                init.noParentTag ? init.content : div({ class: 'modal-body' }, init.content),
                init.noParentTag ? init.footer : div({ class: 'modal-footer' }, init.footer)
            )
        )
    )
}

const tagListBoxInModal = div({ class: 'tagListBox hstack flex-wrap gap-2 px-3 pb-3' })

type TagState = {
    text: State<string>
    selected: State<boolean>
}

/** 所有存在于模态框 DOM 的标签状态列表 */
const allTagStates: TagState[] = []

const TagInModal = (state: TagState) => {
    return div({
        class: () => `tag-select-item success ${state.selected.val ? 'active' : ''}`, onclick() {
            if (tagSearchInputEle.value) {
                tagSearchInputEle.value = ''
                updateTagList()
            }
            state.selected.val = !state.selected.val
        }
    }, state.text)
}

let autoSearchTagTimer: NodeJS.Timeout

const updateTagList = (filter: string = '') => {
    // 清空 Tag DOM 列表
    while (tagListBoxInModal.firstChild) tagListBoxInModal.removeChild(tagListBoxInModal.firstChild)
    allTagStates.filter(state => state.text.val.includes(filter)).forEach(state => {
        van.add(tagListBoxInModal, TagInModal(state))
    })
}

const tagSearchInputEle = input({
    class: 'form-control border-2', placeholder: '输入关键词进行搜索', oninput(event) {
        clearTimeout(autoSearchTagTimer)

        if (event.target.value == '') updateTagList()
        else autoSearchTagTimer = setTimeout(() => updateTagList(event.target.value), 500)
    }
})

/** 选择标签 `.modal-body` */
const selectTagModalEle = MyModal({
    title: '选择标签', content: div({ class: 'modal-body p-0' },
        div({ class: 'sticky-top p-3 bg-white' }, tagSearchInputEle),
        tagListBoxInModal
    ), footer: [
        div({ class: 'modal-footer' },
            button({
                class: 'btn btn-danger', onclick() {
                    allTagStates.forEach(state => state.selected.val = false)
                }
            }, '清除选择'),
            button({
                class: 'btn btn-primary', 'data-bs-dismiss': 'modal', onclick() {
                    allTagStates.filter(state => state.selected.val).forEach(state => {
                        const oldTagList = getTagsFromBox()
                        if (!oldTagList.includes(state.text.val)) van.add(tagListBox, Tag(state.text.val))
                    })
                }
            }, '确定'),
        )
    ], noParentTag: true
})
van.add(document.body, selectTagModalEle)
export const selectTagModal = new Modal(selectTagModalEle)
selectTagModalEle.addEventListener('show.bs.modal', async () => {
    const tags = await fetchTags()
    // 清空 Tag DOM 列表
    while (tagListBoxInModal.firstChild) tagListBoxInModal.removeChild(tagListBoxInModal.firstChild)
    // 清空 Tag State 列表
    allTagStates.splice(0)
    if (tags.length == 0)
        return van.add(tagListBoxInModal, div({ class: 'alert alert-info w-100 mb-0' }, '暂时没有标签可供选择'))
    tags.forEach(tag => {
        const tagState: TagState = { text: van.state(tag.text), selected: van.state(false) }
        allTagStates.push(tagState)
        van.add(tagListBoxInModal, TagInModal(tagState))
    })
})
