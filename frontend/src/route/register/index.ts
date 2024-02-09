import van from 'vanjs-core'
import { Route, routeTo } from 'vanjs-router'
import sgGlobal from '../../state'
import sg from './state'
import sgLogin from '../login/state'
import { checkPassworkFormat, checkUsernameFormat } from '../../util'

const { a, button, div, input, label } = van.tags

export default () => Route({
    name: 'register', onLoad() {
        if (sgGlobal.get('hasLogin').val) routeTo('work')
    },
    class: 'container py-4'
},
    div({ style: 'max-width: 400px;', class: 'mx-auto' },
        div({ class: 'fs-3 text-center mb-4' }, '注册页面'),
        div({ class: 'form-floating mb-3' },
            input({ class: 'form-control', placeholder: '用户名', value: sg.get('username'), oninput: event => sg.get('username').val = event.target.value }),
            label('用户名')
        ),
        div({ class: 'form-floating mb-3' },
            input({ class: 'form-control', placeholder: '用户名', value: sg.get('password'), oninput: event => sg.get('password').val = event.target.value }),
            label('密码')
        ),
        div({ class: 'form-floating mb-4' },
            input({ class: 'form-control', placeholder: '用户名', value: sg.get('password2'), oninput: event => sg.get('password2').val = event.target.value }),
            label('重复密码')
        ),
        button({
            class: 'btn btn-primary w-100 mb-3', onclick() {
                const username = sg.get('username').val
                const password = sg.get('password').val
                const password2 = sg.get('password2').val
                if (!checkUsernameFormat(username)) {
                    alert('用户名必须是 3-20 位字母数字下划线组合')
                } else if (password != password2) {
                    alert('两次输入的密码不一致')
                } else if (!checkPassworkFormat(password)) {
                    alert('密码长度必须为 8-20 任意字符组合')
                } else {
                    fetch('/api/user/register', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username,
                            password
                        })
                    }).then(res => res.json()).then(res => {
                        if (res.success) {
                            alert('注册成功')
                            routeTo('login')
                            sg.get('username').val = ''
                            sg.get('password').val = ''
                            sg.get('password2').val = ''
                            sgLogin.get('username').val = username
                            sgLogin.get('password').val = password
                        }
                        else {
                            alert(res.message)
                        }
                    })
                }
            }
        }, '注册'),
        div({ class: 'text-center' }, a({ href: '#/login' }, '已有账号？点此登录'))
    )
)