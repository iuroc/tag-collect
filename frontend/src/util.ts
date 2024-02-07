import { routeTo } from 'vanjs-router'
import sgGlobal from './state'

export const randStr = (length: number): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    const charsetLength = charset.length
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetLength)
        result += charset[randomIndex]
    }
    return result
}

export const checkLogin = () => fetch('/api/login', { method: 'post' }).then(res => res.json()).then(res => {
    if (res.success) sgGlobal.get('hasLogin').val = true
    else routeTo('home')
})

export const checkUsernameFormat = (username: string) => {
    return Boolean(username.match(/^\w{3,20}$/))
}

export const checkPassworkFormat = (password: string) => {
    return Boolean(password.match(/^.{8,20}$/))
}

export type ResData<T = any> = {
    success: boolean
    message: string
    data: T
}