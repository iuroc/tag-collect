import { routeTo } from 'vanjs-router'
import { getTagsFromBox, tagListBox } from '.'
import { clearDOM } from '../../util'
import { firstLoadCollectList } from '../work/mixin'
import sg from './state'

export const fetchTags = async () => {
    const res = await fetch('/api/tags')
    const data = await res.json()
    if (data.success) return data.data as { text: string, count: number }[]
    else {
        alert(data.message)
        throw new Error(data.message)
    }
}

export const saveAdd = async () => {
    const title = sg.get('title').val.trim()
    const url = sg.get('url').val.trim()
    const desc = sg.get('desc').val.trim()
    const tags = getTagsFromBox()
    if (title == '' && !confirm('确定不填写收藏描述吗？')) return
    if (url == '' && !confirm('确定不填写收藏网址吗？')) return
    await addCollect(title, url, desc, tags)
    sg.get('title').val = ''
    sg.get('url').val = ''
    sg.get('desc').val = ''
    clearDOM(tagListBox)
    firstLoadCollectList()
    routeTo('home')
}

/** 新增收藏 */
const addCollect = async (title: string, url: string, desc: string, tags: string[]) => {
    const res = await fetch('/api/collect/add', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title, url, desc, tags
        })
    })
    const data = await res.json()
    if (!data.success) {
        alert(data.message)
    }
}