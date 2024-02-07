import { Route, routeTo } from 'vanjs-router'
import sgGlobal from '../../state'

export default () => Route({
    name: 'work', onLoad() {
        if (!sgGlobal.get('hasLogin').val) routeTo('home')
    }, class: 'container py-4'
},
    '工作页面'
)