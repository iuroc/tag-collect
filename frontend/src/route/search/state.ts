import van from 'vanjs-core'
import { SG } from '../../state'

export default new SG({
    keyword: van.state(''),
    nextPage: 0,
    loadingLock: false,
    pageSize: 36,
    tags: [] as string[],
    hideSearchTip: van.state(false),
    hideNoResultTip: van.state(true)
})