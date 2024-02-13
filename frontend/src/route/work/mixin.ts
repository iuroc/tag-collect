import van from 'vanjs-core';
import { collectListEle } from '.';
import sg from './state'
import { ListItem } from './view';
import { collectInfoModal } from './view/modal';
import { clearDOM } from '../../util';

export const fetchCollectList = async (page: number = 0, pageSize: number = 36, keyword: string = '', tags: string[] = []): Promise<{
    list: FetchCollect[];
    end: boolean;
}> => {
    const res = await fetch('/api/collect/list', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ page, pageSize, keyword, tags })
    })
    const data = await res.json() as { success: boolean, data: FetchCollect[], message: string }
    if (data.success) return { list: data.data, end: data.data.length < pageSize }
    else {
        alert(data.message)
        return { list: [], end: true }
    }
}

export const fetchDelectCollect = async (collectId: number) => {
    const res = await fetch('/api/collect/delete', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ collectId })
    })
    const data = await res.json()
    if (data.success) {
        firstLoadCollectList()
        collectInfoModal.hide()
    }
    else {
        alert(data.message)
    }
}

type FetchCollect = {
    id: number,
    title: string,
    url: string,
    desc: string,
    tags: string[],
    'create_time': string
}

export const firstLoadCollectList = () => {
    sg.set('nextPage', 0)
    sg.set('loadingLock', false)
    fetchCollectList(0, sg.get('pageSize')).then(({ list, end }) => {
        clearDOM(collectListEle)
        list.map(item => {
            van.add(collectListEle, ListItem(item))
        })
        sg.set('loadingLock', end)
    })
}