import van, { Val } from 'vanjs-core'
import { randItem, shuffleArray } from '../../util'

const { a, button, div, primary } = van.tags
const { svg, path } = van.tagsNS('http://www.w3.org/2000/svg')

export const colorNames = ['primary', 'success', 'danger', 'warning', 'info']

const Tag = (text: string, colorName: string) => {
    return div({
        class: `bg-${colorName}-subtle text-${colorName}-emphasis border border-${colorName}-subtle rounded-1 d-inline-block small`,
        style: 'padding: 2px 5px;'
    }, text)
}

export const ListItem = (init: {
    title: Val<string>,
    url: Val<string>
    tags: Val<string[]>,
    desc: Val<string>
}) => {
    const randColorNames = shuffleArray(colorNames)
    return div({ class: 'col-xl-4 col-md-6' },
        div({ class: 'card list-item' },
            div({ class: 'card-header text-truncate fw-bold title', title: van.val(init.title) },
                svg({ fill: 'currentColor', style: 'height: 1em;', class: 'bi bi-crosshair2 me-2', viewBox: '0 0 16 16' },
                    path({ 'd': 'M8 0a.5.5 0 0 1 .5.5v.518A7 7 0 0 1 14.982 7.5h.518a.5.5 0 0 1 0 1h-.518A7 7 0 0 1 8.5 14.982v.518a.5.5 0 0 1-1 0v-.518A7 7 0 0 1 1.018 8.5H.5a.5.5 0 0 1 0-1h.518A7 7 0 0 1 7.5 1.018V.5A.5.5 0 0 1 8 0m-.5 2.02A6 6 0 0 0 2.02 7.5h1.005A5 5 0 0 1 7.5 3.025zm1 1.005A5 5 0 0 1 12.975 7.5h1.005A6 6 0 0 0 8.5 2.02zM12.975 8.5A5 5 0 0 1 8.5 12.975v1.005a6 6 0 0 0 5.48-5.48zM7.5 12.975A5 5 0 0 1 3.025 8.5H2.02a6 6 0 0 0 5.48 5.48zM10 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0' }),
                ), van.val(init.title)),
            div({ class: 'card-body' },
                a({ class: 'small mb-2 text-truncate d-block', href: van.val(init.url), target: '_blank', title: van.val(init.url) }, van.val(init.url)),
                div({ class: 'mb-2 desc small text-secondary', title: van.val(init.desc) }, van.val(init.desc)),
                div({ class: 'hstack flex-wrap', style: 'gap: .3rem;' }, van.val(init.tags).map((tag, index) => {
                    const color = randColorNames[index % colorNames.length]
                    return Tag(tag, color)
                }))
            ),
        )
    )
}