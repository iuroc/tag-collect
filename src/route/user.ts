import { RouteEvent } from 'apee-router'


export const user: RouteEvent = (route) => {
    if (route.status == 0) {
        route.status = 1
        const clickLogout = route.dom.querySelector('.click-logout') as HTMLButtonElement
        clickLogout.addEventListener('click', () => {
            localStorage.removeItem('expires')
            location.href = '/logout'
        })
    }
}