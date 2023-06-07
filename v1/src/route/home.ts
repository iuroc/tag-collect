import { RouteEvent } from 'apee-router'

/** `hash = #/home` */
const routeEvent: RouteEvent = (route) => {
    function loadDom() {
        let html = ''
        const boxEle = route.dom.querySelector('.btn-list')
        if (!boxEle) throw new Error(`.btn-list 元素不存在`)
        const list: string[][] = [
            ['plus-square-dotted.svg', '新增收藏', 'add'],
            ['card-checklist.svg', '收藏列表', 'list'],
            ['tags.svg', '标签列表', 'tag'],
            ['person-gear.svg', '个人中心', 'user'],
        ]
        list.forEach(item => {
            html += `
                <div class="col-sm-6 col-lg-4 col-xl-3 mb-4">
                    <div class="border border-3 shadow-sm rounded-4 card card-body
                        hover-shadow flex-row align-items-center" onclick="location.hash='#/${item[2]}'">
                        <img src="/static/img/${item[0]}" class="mx-3 size-32">
                        <div class="fs-4">${item[1]}</div>
                    </div>
                </div>`
        })
        boxEle.innerHTML = html
    }
    if (route.status == 0) {
        route.status = 1
        loadDom()
    }
}
export default routeEvent