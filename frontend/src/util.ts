import { activeRoute, routeTo } from 'vanjs-router'
import { sgGlobal } from './state'

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

export const checkLogin = () => fetch('/api/user/login', { method: 'post' }).then(res => res.json()).then(res => {
    if (res.success) {
        sgGlobal.get('hasLogin').val = true
    }
    else if (activeRoute.val.name != 'login' && activeRoute.val.name != 'register') {
        routeTo('home')
    }
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

/** 获取数组中的随机一个元素 */
export const randItem = <T>(arr: T[]) => {
    const newArr = arr.flat()
    return newArr[Math.floor(Math.random() * newArr.length)]
}

/** 打乱数组，不影响原数组 */
export const shuffleArray = <T>(array: T[]) => {
    const newArr = [...array]
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = newArr[i]
        newArr[i] = newArr[j]
        newArr[j] = temp
    }
    return newArr
}

/** 清空 DOM 元素，移除所有子元素 */
export const clearDOM = (ele: HTMLElement) => {
    while (ele.firstChild) ele.removeChild(ele.firstChild)
}

export const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    const hours = ('0' + date.getHours()).slice(-2)
    const minutes = ('0' + date.getMinutes()).slice(-2)
    const seconds = ('0' + date.getSeconds()).slice(-2)
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}