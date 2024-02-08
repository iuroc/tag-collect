import van, { ChildDom, Val } from 'vanjs-core'
import { Modal } from 'bootstrap'
import { fetchTags } from '../mixin'

const { br, button, div, input } = van.tags

export const MyModal = (init: {
    title: Val<string>,
    content: ChildDom,
    footer: ChildDom,
    fade?: boolean,
    static?: boolean,
    keyboard?: boolean,
    parentTag?: boolean
}) => {

    return div({
        class: `modal ${(typeof init.fade == 'undefined' || init.fade) ? 'fade' : ''}`,
        ...(init.static ? { 'data-bs-backdrop': init.static } : {}),
        ...(init.keyboard ? { 'data-bs-keyboard': init.keyboard } : {}),
        tabindex: -1
    },
        div({ class: 'modal-dialog modal-dialog-scrollable' },
            div({ class: 'modal-content' },
                div({ class: 'modal-header' },
                    div({ class: 'h5 modal-title' }, init.title),
                    button({ class: 'btn-close', 'data-bs-dismiss': 'modal' })
                ),
                init.parentTag ? div({ class: 'modal-body' }, init.content) : init.content,
                init.parentTag ? div({ class: 'modal-footer' }, init.footer) : init.footer
            )
        )
    )
}

const selectTagModalEle = MyModal({
    title: '选择标签', content: div({ class: 'modal-body p-0' },
        div({ class: 'sticky-top p-3 bg-white' },
            input({ class: 'form-control', placeholder: '输入关键词进行搜索' })
        ),
        div({ class: 'tagListBox px-3 pb-3' },

        )
    ), footer: [

    ], parentTag: false
})
van.add(document.body, selectTagModalEle)
export const selectTagModal = new Modal(selectTagModalEle)
selectTagModalEle.addEventListener('show.bs.modal', async () => {
    const tags = await fetchTags()
    console.log(tags)
})