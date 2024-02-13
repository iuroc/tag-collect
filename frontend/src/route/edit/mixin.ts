import { routeTo } from 'vanjs-router'
import { Tag, editorView, getTagsFromBox, tagInputEle, tagListBox } from '.'
import { clearDOM } from '../../util'
import { firstLoadCollectList } from '../work/mixin'
import sg from './state'
import van from 'vanjs-core'

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
    const desc = editorView.state.doc.toString()
    const tags = getTagsFromBox()
    const mode = sg.get('mode')
    if (mode == 'add') {
        await addCollect(title, url, desc, tags)
    } else {
        await updateCollect(sg.get('id').val, title, url, desc, tags)
    }

    claerEditInputAndTag()
    firstLoadCollectList()
    routeTo('home')
}

/** 清空编辑框和标签列表 */
export const claerEditInputAndTag = () => {
    sg.get('title').val = ''
    sg.get('url').val = ''
    tagInputEle.value = ''
    editorView.dispatch(editorView.state.update({ changes: { from: 0, to: editorView.state.doc.length, insert: '' } }))
    clearDOM(tagListBox)
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

export const loadCollectInfo = async (collectId: number) => {
    const res = await fetch('/api/collect/get', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ collectId })
    })
    const data = await res.json() as { success: boolean, message: string, data: { title: string, url: string, desc: string, tags: string[] } }
    if (data.success) {
        sg.get('title').val = data.data.title
        sg.get('url').val = data.data.url
        editorView.dispatch(editorView.state.update({ changes: { from: 0, to: editorView.state.doc.length, insert: data.data.desc } }))
        clearDOM(tagListBox)
        const tags = data.data.tags as string[]
        tags.forEach(tag => {
            tagListBox.appendChild(Tag(tag))
        })
    } else {
        alert(data.message)
    }
}

const updateCollect = (collectId: number, title: string, url: string, desc: string, tags: string[]) => {
    return fetch('/api/collect/update', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            collectId, title, url, desc, tags
        })
    })
}

export const getTitle = async (url: string) => {
    const res = await fetch(`https://get-html.apee.workers.dev/?url=${encodeURIComponent(url)}&type=title`)
    const data = await res.json() as { code: number, data: string, msg: string }
    if (data.code != 200) {
        alert(data.msg)
        return ''
    }
    const title = data.data
    const tempDOM = document.createElement('div')
    tempDOM.innerHTML = title
    const titleText = tempDOM.textContent
    return titleText
}

export const workSplit = async (text: string) => {
    const res = await fetch('/api/tags/cut', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    })
    const data = await res.json() as { success: number, data: string[], mesage: string }
    return data.data
}

export const insertTags = (tags: string[]) => {
    tags.forEach(tag => {
        const tagSelected = getTagsFromBox()
        if (!tagSelected.includes(tag) && tag) {
            van.add(tagListBox, Tag(tag))
        }
    })
}