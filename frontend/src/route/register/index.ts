import van from 'vanjs-core'
import { Route, routeTo } from 'vanjs-router'
import sgGlobal from '../../state'

const { div } = van.tags

export default () => Route({
    name: 'register', onLoad() {
        if (sgGlobal.get('hasLogin').val) routeTo('work')
    }
},
    div('注册页面')
)