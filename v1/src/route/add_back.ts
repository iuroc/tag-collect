import { RouteEvent } from 'apee-router'
import { getTitleByUrl } from '../util'
import { apiConfig } from '../config'

/** `hash = #/add` */
const routeEvent: RouteEvent = (route) => {
    /** 网址输入框 */
    const urlInput = route.dom.querySelector('.input-url') as HTMLInputElement
    /** 标题输入框 */
    const titleInput = route.dom.querySelector('.input-title') as HTMLInputElement
    /** 标签输入框 */
    const tagInput = route.dom.querySelector('.input-tag') as HTMLInputElement
    /** 描述文本输入框 */
    const textInput = route.dom.querySelector('.input-text') as HTMLTextAreaElement
    /** 点击提取根地址 */
    const getOrigin = route.dom.querySelector('.get-origin') as HTMLButtonElement
    /** 自动抓取 `title` */
    const getTitle = route.dom.querySelector('.get-title') as HTMLButtonElement
    /** 提交收藏 */
    const submit = route.dom.querySelector('.submit') as HTMLButtonElement
    /** 添加标签 */
    const addTag = route.dom.querySelector('.add-tag') as HTMLButtonElement
    /** 选择标签 */
    const selectTag = route.dom.querySelector('.select-tag') as HTMLButtonElement
    /** 生成标签 */
    const generateTag = route.dom.querySelector('.generate-tag') as HTMLButtonElement
    /** 标签列表 DOM */
    const tagListEle = route.dom.querySelector('.tag-list') as HTMLDivElement
    /** 重置表单按钮 */
    const resetBtn = route.dom.querySelector('.reset') as HTMLButtonElement
    urlInput.focus()
    if (route.status == 0) {
        route.status = 1
        /** 正在显示的标签列表 */
        const tagList: string[] = []
        /** 获取 URL 根地址 */
        const getOriginListener = () => {
            urlInput.focus()
            try {
                urlInput.value = new URL(urlInput.value).origin
            } catch { }
        }
        /** 获取标题 */
        const getTitleListener = () => {
            try {
                new URL(urlInput.value)
            } catch {
                return alert('你输入的 URL 不合法')
            }
            getTitle.setAttribute('disabled', 'disabled')
            let oldText = getTitle.innerText
            getTitle.innerText = '正在抓取'
            /** 按钮复位 */
            function back() {
                getTitle.removeAttribute('disabled')
                getTitle.innerHTML = oldText
            }
            getTitleByUrl(urlInput.value).then(title => {
                back(), titleInput.value = title
            }).catch(() => {
                back(), alert('获取失败')
            })
        }
        /** 重置表单 */
        const reset = () => {
            route.dom.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea').forEach(ele => ele.value = '')
            tagListEle.innerHTML = ''
            tagListEle.append(emptyTag)
            tagList.splice(0, tagList.length)
        }
        /** 选择标签 */
        const selectTagListener = () => {
            location.hash = '/tag/call'
        }
        /** 生成标签 */
        const generateTagListener = () => {

        }
        /** 标签列表为空时显示的元素 */
        const emptyTag = document.createElement('button')
        emptyTag.setAttribute('class', 'btn mb-3 w-100 border border-2')
        emptyTag.innerText = '当前标签列表为空'
        tagListEle.append(emptyTag)
        /** 添加标签 */
        const addTagListener = () => {
            tagInput.focus()
            let tagName = tagInput.value
            tagInput.value = ''
            if (tagName.match(/^\s*$/)) return
            // 判断当前标签是否存在显示列表中
            if (tagList.includes(tagName)) return
            /** 新的标签元素 */
            const newTag = document.createElement('button')
            newTag.setAttribute('class', 'btn border-primary text-primary shadow-sm border border-2 me-2 mb-3')
            newTag.innerText = tagName
            newTag.addEventListener('click', () => {
                // 获取当前点击的元素的下标
                let index = tagList.indexOf(tagName)
                // 从 tagList 数组中删除该标签
                tagList.splice(index, 1)
                // 移除这个标签元素
                newTag.remove()
                // 移除标签后，标签列表为空，则显示空提示
                if (tagList.length == 0)
                    tagListEle.append(emptyTag)
                tagInput.focus()
            })
            // 如果添加标签前，标签列表为空，则先移除空提示
            if (tagList.length == 0)
                emptyTag.remove()
            // 将新的标签元素加入到标签列表显示中
            tagListEle.append(newTag)
            // 将新标签名称加入到 tagList 数组
            tagList.push(tagName)
        }
        getOrigin.addEventListener('click', getOriginListener)
        urlInput.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') getOriginListener()
        })
        getTitle.addEventListener('click', getTitleListener)
        titleInput.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') getTitleListener()
        })
        addTag.addEventListener('click', addTagListener)
        tagInput.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') addTagListener()
        })
        submit.addEventListener('click', () => {
            let url = urlInput.value
            let title = titleInput.value
            let text = textInput.value
            const tags = tagList
            if (url.match(/^\s*$/) && text.match(/^\s*$/))
                return alert('URL 和描述文本不能同时为空')
            const xhr = new XMLHttpRequest()
            xhr.open('POST', apiConfig.add)
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
            xhr.send(JSON.stringify({ url, title, text, tags }))
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    const res = JSON.parse(xhr.responseText)
                    let code: number = res.code
                    if (code == 200) reset()
                    alert(res.msg)
                }
            }
        })
        resetBtn.addEventListener('click', reset)
        selectTag.addEventListener('click', selectTagListener)
        generateTag.addEventListener('click', generateTagListener)
    }
}
export default routeEvent