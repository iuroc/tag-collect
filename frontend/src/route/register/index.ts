import van from 'vanjs-core'
import { Route, routeTo } from 'vanjs-router'
import { testRegister } from '../../test'

const { div } = van.tags

export default Route({ name: 'register' },
    div('注册页面')
)

testRegister()