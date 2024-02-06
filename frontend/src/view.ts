import van, { ChildDom, PropValueOrDerived, State, Val } from 'vanjs-core'
import { randStr } from './util'

const { a, button, div, li, span, ul } = van.tags

export const Header = () => {
    const id = randStr(10)
    return div({ class: 'navbar navbar-expand-md bg-body-tertiary' },
        div({ class: 'container' },
            div({ class: 'navbar-brand' }, 'Tag Collect'),
            button({ class: 'navbar-toggler', 'data-bs-toggle': 'collapse', 'data-bs-target': `#${id}` },
                span({ class: 'navbar-toggler-icon' })
            ),
            div({ class: 'collapse navbar-collapse', id },
                ul({ class: 'navbar-nav' },
                    NavItem('主页', '#', true)
                )
            )
        )
    )
}

const NavItem = (
    text: ChildDom,
    href: Val<string>,
    active: Val<boolean>
) => {
    const getVal = <T>(val: Val<T>) => (val as State<T>).val == undefined ? val as T : (val as State<T>).val as T
    const classStr = van.derive(() => `nav-link ${getVal(active) ? 'active' : ''}`)
    return li({ class: 'nav-item' },
        a({ href, class: classStr }, text)
    )
}