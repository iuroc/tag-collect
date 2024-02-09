import { Route, routeTo } from 'vanjs-router'
import { sgGlobal } from '../../state'
import van from 'vanjs-core'

const { button, div } = van.tags

export default () => Route({
    name: 'user', onLoad() {
        if (!sgGlobal.get('hasLogin').val) routeTo('home')
    }, class: 'container py-4'
},
    div({ class: 'fs-3 mb-4' }, '个人中心'),
    button({
        class: 'btn btn-danger', onclick() {
            if (confirm('确定要退出登录吗？')) location.href = '/api/user/logout'
        }
    }, '退出登录')
)