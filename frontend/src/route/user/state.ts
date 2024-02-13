import van from 'vanjs-core'
import { SG } from '../../state'

export default new SG({
    password: van.state(''),
    password2: van.state(''),
})