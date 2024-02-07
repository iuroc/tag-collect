import van from 'vanjs-core'
import { Route, routeTo } from 'vanjs-router'

const { div } = van.tags

export default Route({ name: 'login', class: 'container py-4' },
    div('登录页面')
)