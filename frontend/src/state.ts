import van, { State } from 'vanjs-core'
import { SG } from './util'

const sgGlobal = new SG<{
    /** 是否登录 */
    hasLogin: State<boolean>
}>({
    hasLogin: van.state(false)
})

export default sgGlobal