import van from 'vanjs-core'
import { Route, routeTo } from 'vanjs-router'

const { div } = van.tags

export default () => Route({ name: 'about', class: 'container py-4' },
    div('关于页面')
)