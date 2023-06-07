import ApeeRouter from 'apee-router'

/** 载入组件 */
export function loadTemplate(router: ApeeRouter) {
    loadBackNav(router)
    loadSubTitle()
}

/**
 * 加载带返回按钮的顶栏
 * @param router 路由管理器对象，用于实现返回上一级历史记录
 */
function loadBackNav(router: ApeeRouter) {
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