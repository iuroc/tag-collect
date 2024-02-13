import { SG } from '../../../src/state'
import van from 'vanjs-core'

export default new SG({
    modal: {
        title: van.state(''),
        url: van.state(''),
        id: 0,
        createTime: van.state(''),
        fromRoute: 'work' as 'work' | 'search'
    },
    nextPage: 0,
    loadingLock: false,
    pageSize: 36
})