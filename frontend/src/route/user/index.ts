import { Route, routeTo } from 'vanjs-router'
import { sgGlobal } from '../../state'
import van from 'vanjs-core'
import sg from './state'
import { checkPassworkFormat } from '../../util'

const { button, div, input, span, text } = van.tags

export default () => Route({
    name: 'user', onLoad() {
        if (!sgGlobal.get('hasLogin').val) routeTo('home')
    }, class: 'container py-4'
},
    div({ class: 'fs-3 mb-4' }, '个人中心'),
    div({ class: 'mb-4' },
        div({ class: 'fw-bold fs-5 mb-3' }, '修改密码'),
        div({ class: 'input-group mb-3', style: 'max-width: 500px;' },
            input({ class: 'form-control', type: 'text', value: sg.get('password'), oninput: event => sg.get('password').val = event.target.value, placeholder: '请输入新密码' }),
        ),
        div({ class: 'input-group', style: 'max-width: 500px;' },
            input({ class: 'form-control', type: 'text', value: sg.get('password2'), oninput: event => sg.get('password2').val = event.target.value, placeholder: '请重复输入新密码' }),
            button({
                class: 'btn btn-info', async onclick() {
                    const password = sg.get('password').val
                    const password2 = sg.get('password2').val
                    if (password !== password2) return alert('两次输入的密码不一致')
                    if (!checkPassworkFormat(password)) return alert('密码格式不正确，要求长度为 8-20 的任意字符串')
                    const res = await fetch('/api/user/resetPassword', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ password })
                    })
                    const data = await res.json() as { success: boolean }
                    if (data.success) {
                        alert('修改成功')
                        sg.get('password').val = ''
                        sg.get('password2').val = ''
                    }
                }
            }, '修改密码')
        ),
    ),
    button({
        class: 'btn btn-danger', onclick() {
            if (confirm('确定要退出登录吗？')) location.href = '/api/user/logout'
        }
    }, '退出登录')
)