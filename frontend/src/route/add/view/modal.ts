import van, { ChildDom, Val } from 'vanjs-core'
import { Modal } from 'bootstrap'

const { button, div } = van.tags

export const MyModal = (init: {
    title: Val<string>,
    content: ChildDom,
    footer: ChildDom,
    fade?: boolean,
    static?: boolean,
    keyboard?: boolean
}) => {

    return div({
        class: `modal ${(typeof init.fade == 'undefined' || init.fade) ? 'fade' : ''}`,
        ...(init.static ? { 'data-bs-backdrop': init.static } : {}),
        ...(init.keyboard ? { 'data-bs-keyboard': init.keyboard } : {}),
        tabindex: -1
    },
        div({ class: 'modal-dialog' },
            div({ class: 'modal-content' },
                div({ class: 'modal-header' },
                    div({ class: 'h5 modal-title' }, init.title),
                    button({ class: 'btn-close', 'data-bs-dismiss': 'modal' })
                ),
                div({ class: 'modal-body' }, init.content),
                div({ class: 'modal-footer' }, init.footer)
            )
        )
    )
}

const selectTagModalEle = MyModal({
    title: '选择标签', content: [

    ], footer: [

    ]
})
van.add(document.body, selectTagModalEle)
export const selectTagModal = new Modal(selectTagModalEle)