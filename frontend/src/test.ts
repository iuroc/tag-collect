export const testRegister = () => {
    fetch('/api/register', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'test',
            password: '123456'
        })
    }).then(res => res.json()).then(data => {
        console.log(data)
    })
}
