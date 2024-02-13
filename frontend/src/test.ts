import { sgGlobal } from './state'

export const testRegister = () => {
    fetch('/api/user/register', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'iuroc',
            password: '12345678'
        })
    }).then(res => res.json()).then(data => {
        console.log(data)
    })
}


export const testLogin = () => {
    fetch('/api/user/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: '360',
            password: '123456'
        })
    }).then(res => res.json()).then(data => {
        if (data.success) sgGlobal.get('hasLogin').val = true
    })
}

export const testGetCollectList = () => {
    fetch('/api/collect/list', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            page: 0,
            pageSize: 10
        })
    }).then(res => res.json()).then(data => {
        console.table(data.data)
    })
}