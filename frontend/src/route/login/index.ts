import van from 'vanjs-core'
import { Route, routeTo } from 'vanjs-router'
import { sgGlobal } from '../../state'
import sg from './state'
import { ResData, checkPassworkFormat, checkUsernameFormat } from '../../util'

const { a, button, div, input, label } = van.tags

export default () => {
    return Route({
        name: 'login', onLoad() {
            if (sgGlobal.get('hasLogin').val) routeTo('work')
        }, class: 'container py-4'
    },
        div({ style: 'max-width: 400px;', class: 'mx-auto' },
            div({ class: 'fs-3 text-center mb-4' }, '用户登录'),
            div({ class: 'form-floating mb-3' },
                input({ class: 'form-control', type: 'text', placeholder: '用户名', value: sg.get('username'), oninput: event => sg.get('username').val = event.target.value }),
                label({ class: 'form-label' }, '用户名'),
            ),
            div({ class: 'form-floating mb-4' },
                input({ class: 'form-control', type: 'password', placeholder: '密码', value: sg.get('password'), autocomplete: 'new-password', oninput: event => sg.get('password').val = event.target.value }),
                label({ class: 'form-label' }, '密码'),
            ),
            button({
                class: 'btn btn-primary w-100 mb-3', onclick() {
                    const username = sg.get('username').val
                    const password = sg.get('password').val
                    if (!checkUsernameFormat(username)) {
                        alert('用户名必须是 3-20 位字母数字下划线组合')
                    } else if (!checkPassworkFormat(password)) {
                        alert('密码长度必须为 8-20 任意字符组合')
                    } else {
                        fetch('/api/user/login', {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                username, password
                            })
                        }).then(res => res.json()).then((data: ResData) => {
                            if (data.success) {
                                sgGlobal.get('hasLogin').val = true
                                routeTo('work')
                                sg.get('username').val = ''
                                sg.get('password').val = ''
                            } else {
                                alert(data.message)
                            }
                        })
                    }
                }
            }, '登录'),
            div({ class: 'text-center' }, a({ href: '#/register' }, '没有账号？点此注册'))
        )
    )
}