import van from 'vanjs-core';
import { collectListEle } from '.';
import sg from './state'
import { ListItem } from './view';
import { collectInfoModal } from './view/modal';

export const fetchCollectList = async (page: number = 0, pageSize: number = 36): Promise<{
    list: FetchCollect[];
    pageSize: number;
}> => {
    const res = await fetch('/api/collect/list', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ page, pageSize })
    })
    const data = await res.json()
    if (data.success) return { list: data.data, pageSize }
    else {
        alert(data.message)
        return { list: [], pageSize }
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
}

export const firstLoadCollectList = () => {
    sg.set('nextPage', 0)
    sg.set('loadingLock', false)
    fetchCollectList().then(data => {
        while (collectListEle.firstChild) collectListEle.removeChild(collectListEle.firstChild)
        data.list?.map(item => {
            van.add(collectListEle, ListItem(item))
        })
    })
}