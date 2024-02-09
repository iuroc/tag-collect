import { SG } from '../../state'
import van from 'vanjs-core'

export default new SG({
    title: van.state(''),
    url: van.state(''),
    desc: van.state(''),
})