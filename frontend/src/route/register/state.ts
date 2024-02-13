import van from 'vanjs-core'
import { SG } from '../../state'

export default new SG({
    username: van.state(''),
    password: van.state(''),
    password2: van.state('')
})