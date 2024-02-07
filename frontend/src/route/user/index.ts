import { Route, routeTo } from 'vanjs-router'
import sgGlobal from '../../state'

export default Route({
    name: 'user', onLoad() {
        if (!sgGlobal.get('hasLogin').val) routeTo('home')
    }, class: 'container py-4'
},
    '个人中心'
)