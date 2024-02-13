import { searchResultListEle } from '.'
import { clearDOM } from '../../util'
import { fetchCollectList } from '../work/mixin'
import { ListItem } from '../work/view'
import sg from './state'
import van from 'vanjs-core'

export const clickSearch = async (event?: KeyboardEvent | MouseEvent | null, tags?: string[]) => {
    // 如果是按下键盘，但是并不是回车键
    if (event instanceof KeyboardEvent && event.key != 'Enter') return
    
    const keyword = van.val(sg.get('keyword'))
    // 如果关键词为空，不做处理
    if (!keyword && (!tags || tags.length == 0)) return
    sg.get('hideSearchTip').val = true
    sg.get('hideNoResultTip').val = true
    // 触发搜索后，清空输入框
    sg.get('keyword').val = ''
    const { list, end } = await fetchCollectList(0, sg.get('pageSize'), keyword, tags)
    clearDOM(searchResultListEle)
    if (list.length == 0) return sg.get('hideNoResultTip').val = false
    list.forEach(item => {
        van.add(searchResultListEle, ListItem(item))
    })
    sg.set('nextPage', 0)
    sg.set('loadingLock', end)
}
