/** 编译：tsc workers/get_html.ts --target esnext -w */

export default {
    async fetch(request: Request) {
        const params = new URL(request.url).searchParams
        let url = params.get('url')
        let type = params.get('type')
        try {
            if (!url) throw new Error()
            new URL(url || '')
        } catch {
            return makeErr('url 参数不合法')
        }
        try {
            const text = await getRes(url)
            if (type == 'title')
                return makeRes(makeTitle(url, text))
            return makeRes(text)
        } catch (e) {
            return makeErr(e)
        }
    }
}

/** 生成 Title 标题 */
function makeTitle(url: string, text: string): string {
    const result = text.match(/<title.*?>(.*?)<\/title>/)
    if (result) return result[1]
    let domain = new URL(url).hostname
    let title = domain.replace(/^www\./, '').replace(/\.[^.]*$/, '').split('.').map(word => {
        return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
    return title
}

function getRes(url: string) {
    return new Promise<string>((resolve, reject) => {
        const error = (reason: Error) => {
            clearTimeout(timer)
            reject(reason)
        }
        const timer = setTimeout(error, 10000)
        fetch(url).then(res => {
            res.text().then(text => {
                clearTimeout(timer)
                resolve(text)
            }).catch(error)
        }).catch(error)
    })
}

/** 响应配置 */
const option = {
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
    }
}

/** 生成响应对象 */
function makeRes(data: string | null, msg: string = '获取成功', code: number = 200) {
    let json = JSON.stringify({ code, msg, data })
    return new Response(json, option)
}

/** 生成错误响应对象 */
function makeErr(msg: string = '获取失败', code: number = 0) {
    return makeRes(null, msg, code)
}