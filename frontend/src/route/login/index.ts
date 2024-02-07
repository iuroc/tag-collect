import van from 'vanjs-core'
import { Route, routeTo } from 'vanjs-router'
import sgGlobal from '../../state'

const { div } = van.tags

export default Route({
    name: 'login', onLoad() {
        if (sgGlobal.get('hasLogin').val) routeTo('work')
    }, class: 'container py-4'
},
    div('登录页面')
)