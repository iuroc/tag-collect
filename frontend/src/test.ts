export const testRegister = () => {
    fetch('/api/register', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: '360',
            password: '123456'
        })
    }).then(res => res.json()).then(data => {
        console.log(data)
    })
}


export const testLogin = () => {
    fetch('/api/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: '360',
            password: '123456'
        })
    }).then(res => res.json()).then(data => {
        console.log(data)
    })
}