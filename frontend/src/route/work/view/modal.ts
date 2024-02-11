import van from 'vanjs-core'
import { MyModal } from '../../edit/view/modal'
import { Modal } from 'bootstrap'
import sg from '../state'
import ClipboardJS from 'clipboard'
import { fetchDelectCollect } from '../mixin'
import { routeTo } from 'vanjs-router'

const { _blank, a, button, div, span } = van.tags
const { svg, path } = van.tagsNS('http://www.w3.org/2000/svg')

export const tagBoxEleInModal = div({ class: 'hstack flex-wrap gap-2 mb-2' })
export const markdownViewEleInModal = div({ class: 'markdown-body mb-4' })

export const collectInfoModalEle = MyModal({
    title: '收藏详情',
    content: [
        div({ class: 'p-3 bg-light rounded-3 border border-light-subtle mb-3' },
            div({ class: 'hstack mb-2', hidden: () => sg.obj('modal').get('title').val == '' },
                svg({ fill: 'currentColor', class: 'bi bi-crosshair2 me-2 h-w-1em flex-shrink-0', viewBox: '0 0 16 16' },
                    path({ 'd': 'M8 0a.5.5 0 0 1 .5.5v.518A7 7 0 0 1 14.982 7.5h.518a.5.5 0 0 1 0 1h-.518A7 7 0 0 1 8.5 14.982v.518a.5.5 0 0 1-1 0v-.518A7 7 0 0 1 1.018 8.5H.5a.5.5 0 0 1 0-1h.518A7 7 0 0 1 7.5 1.018V.5A.5.5 0 0 1 8 0m-.5 2.02A6 6 0 0 0 2.02 7.5h1.005A5 5 0 0 1 7.5 3.025zm1 1.005A5 5 0 0 1 12.975 7.5h1.005A6 6 0 0 0 8.5 2.02zM12.975 8.5A5 5 0 0 1 8.5 12.975v1.005a6 6 0 0 0 5.48-5.48zM7.5 12.975A5 5 0 0 1 3.025 8.5H2.02a6 6 0 0 0 5.48 5.48zM10 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0' }),
                ), span({ class: 'fw-bold break-all' }, sg.obj('modal').get('title')),
            ),
            div({ class: 'hstack mb-2', hidden: () => sg.obj('modal').get('url').val == '' },
                svg({ fill: 'currentColor', class: 'bi bi-box-arrow-up-right me-2 h-w-1em flex-shrink-0', viewBox: '0 0 16 16' },
                    path({ 'fill-rule': 'evenodd', 'd': 'M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5' }),
                    path({ 'fill-rule': 'evenodd', 'd': 'M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z' }),
                ), a({ href: sg.obj('modal').get('url'), class: 'break-all', target: '_blank' }, sg.obj('modal').get('url'))
            ),
            div({ class: 'hstack' },
                svg({ fill: "currentColor", class: "bi bi-clock me-2 h-w-1em flex-shrink-0", viewBox: "0 0 16 16" },
                    path({ "d": "M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" }),
                    path({ "d": "M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" }),
                ), sg.obj('modal').get('createTime')
            )
        ),
        markdownViewEleInModal,
        tagBoxEleInModal
    ],
    footer: [
        button({
            class: 'btn btn-primary btn-sm me-auto',
            onclick() { window.open(sg.obj('modal').get('url').val) },
            hidden: () => sg.obj('modal').get('url').val == ''
        }, '访问网址'),
        button({
            class: 'btn btn-success btn-sm', 'data-clipboard-text': sg.obj('modal').get('url'), onclick() {
                const oldText = this.innerText
                this.innerText = '复制成功'
                this.setAttribute('disabled', 'disabled')
                setTimeout(() => {
                    this.innerText = oldText
                    this.removeAttribute('disabled')
                }, 2000)
            },
            hidden: () => sg.obj('modal').get('url').val == ''
        }, '复制网址'),
        button({
            class: 'btn btn-primary btn-sm', onclick() {
                history.replaceState(null, '', `#/${sg.obj('modal').get('fromRoute')}`)
                routeTo('edit', [sg.obj('modal').get('id')])
                collectInfoModal.hide()
            }
        }, '编辑'),
        button({
            class: 'btn btn-danger btn-sm', onclick() {
                if (confirm('确定要删除吗？')) {
                    const { id } = sg.get('modal')
                    fetchDelectCollect(id)
                }
            }
        }, '删除'),
    ],
    size: 'lg',
    closeIsBack: true,
    static: true
})

van.add(document.body, collectInfoModalEle)
export const collectInfoModal = new Modal(collectInfoModalEle)

new ClipboardJS('[data-clipboard-text]', {
    container: collectInfoModalEle
})

collectInfoModalEle.addEventListener('shown.bs.modal', () => {
    routeTo(sg.obj('modal').get('fromRoute'), ['view'])
})

collectInfoModalEle.addEventListener('hidePrevented.bs.modal', () => {
    history.back()
})