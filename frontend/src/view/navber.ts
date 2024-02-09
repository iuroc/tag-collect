import van, { ChildDom, Val } from 'vanjs-core'
import { randStr } from '../util'
import { activeRoute } from 'vanjs-router'
import { Collapse } from 'bootstrap'
import { sgGlobal } from '../state'

const { a, button, div, span } = van.tags

export const Navbar = () => {
    const id = randStr(10)
    const element = div({ class: 'navbar navbar-expand-sm sticky-top bg-primary-subtle bg-gradient border-bottom border-2 border-primary-subtle', },
        div({ class: 'container' },
            a({ class: 'navbar-brand text-primary-emphasis', href: '#/work' }, 'Tag Collect'),
            button({ class: 'navbar-toggler', 'data-bs-toggle': 'collapse', 'data-bs-target': `#${id}` },
                span({ class: 'navbar-toggler-icon' })
            ),
            div({ class: 'collapse navbar-collapse', id },
                div({ class: 'navbar-nav' },
                    NavItem('主页', ['work', 'home'], van.derive(() => !sgGlobal.get('hasLogin').val)),
                    NavItem('新增收藏', 'add', van.derive(() => !sgGlobal.get('hasLogin').val)),
                    NavItem('记录搜索', 'search', van.derive(() => !sgGlobal.get('hasLogin').val)),
                    NavItem('个人中心', 'user', van.derive(() => !sgGlobal.get('hasLogin').val)),
                ),
                div({ class: 'navbar-nav ms-auto' },
                    NavItem('登录 / 注册', ['login', 'register'], sgGlobal.get('hasLogin')),
                )
            )
        )
    )
    new Collapse(element)
    return element
}

const NavItem = (
    text: ChildDom,
    routeName: Val<string | string[]>,
    hidden: Val<boolean> = false
) => {
    const routeNames = van.derive(() => {
        const val = van.val(routeName)
        return typeof val == 'string' ? [val] : val
    })
    const classStr = van.derive(() => `nav-link text-primary-emphasis ${van.val(routeNames).includes(van.val(activeRoute).name) ? 'active fw-bold' : ''}`)
    return div({ class: 'nav-item', role: 'button', hidden },
        a({ href: () => `#/${van.val(routeNames)[0]}`, class: classStr }, text)
    )
}