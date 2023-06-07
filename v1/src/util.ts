import { apiConfig } from './config'

/** 通过 `URL` 获取标题 */
export function getTitleByUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', apiConfig.getTitle + encodeURIComponent(url), true)
        xhr.timeout = 3000
        xhr.send()
        xhr.onreadystatechange = () => {
            if (xhr.status == 200 && xhr.readyState == 4) {
                const res = JSON.parse(xhr.responseText)
                resolve(res.data)
            }
        }
        xhr.onerror = xhr.ontimeout = reject
    })
}

