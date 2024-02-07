import { SG } from '../../util'
import van from 'vanjs-core'

export default new SG({
    panelA: new SG({
        num: van.state(123)
    })
})