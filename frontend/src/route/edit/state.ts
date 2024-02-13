import { SG } from '../../state'
import van from 'vanjs-core'

export default new SG({
    title: van.state(''),
    url: van.state(''),
    id: van.state(0),
    mode: 'add' as 'add' | 'update',
    modal: {
        fromRoute: 'edit' as 'search' | 'edit'
    },
    getTitleLoading: van.state(false)
})