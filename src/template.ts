/** 载入组件 */
import { Router } from 'apee-router'
export function loadTemplate(router: Router) {
    loadBackNav(router)
    loadSubTitle()
}


/**
 * 加载带返回按钮的顶栏
 * @param router 路由管理器对象，用于实现返回上一级历史记录
 * @param isRow 是否使用响应式栅栏
 */
function loadBackNav(router: Router) {
    /** 返回上一级事件 */
    const backEvent = () => {
        // 如果发生过 hashChange 事件，则返回上一级，否则转到空路由
        if (router.hashChanged) history.back()
        else location.hash = ''
    }
    document.querySelectorAll('back-nav').forEach(ele => {
        let title = ele.innerHTML
        const newEle = document.createElement('div')
        newEle.classList.add('d-flex', 'mb-4', 'align-items-center')
        newEle.innerHTML = `
            <img src="/static/img/arrow-left-circle.svg" class="cursor-pointer size-32 back-btn">
            <div class="fs-3 fw-bold ms-3">${title}</div>`
        newEle.querySelector<HTMLElement>('.back-btn')?.addEventListener('click', backEvent)
        ele.replaceWith(newEle)
    })

    document.querySelectorAll('back-nav-row').forEach(ele => {
        let title = ele.innerHTML
        const newEle = document.createElement('dvi')
        newEle.classList.add('row')
        let html = `
            <div class="col-xl-8 col-lg-7 col-md-6">
                <div class="d-flex mb-4 align-items-center back-nav">
                    <img src="/static/img/arrow-left-circle.svg" class="cursor-pointer size-32 back-btn">
                    <div class="fs-3 fw-bold ms-3">${title}</div>
                </div>
            </div>
            <div class="col-xl-4 col-lg-5 col-md-6 mb-4">
                <div class="input-group shadow-sm rounded input-group">
                    <input type="text" placeholder="请输入搜索关键词" class="form-control">
                    <button class="btn btn-success">搜索</button>
                </div>
            </div>`
        newEle.innerHTML = html
        newEle.querySelector<HTMLElement>('.back-btn')?.addEventListener('click', backEvent)
        ele.replaceWith(newEle)
    })
}
/** 加载带图标的小标题 */
function loadSubTitle() {
    document.querySelectorAll('sub-title').forEach(ele => {
        let title = ele.innerHTML
        const newEle = document.createElement('div')
        newEle.classList.add('d-flex', 'mb-4', 'align-items-center')
        newEle.innerHTML = `
            <img src="/static/img/tags.svg" class="cursor-pointer size-20 back-btn">
            <div class="fs-5 fw-bold ms-2">${title}</div>`
        ele.replaceWith(newEle)
    })
}