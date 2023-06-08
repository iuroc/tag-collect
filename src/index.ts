import { Router } from 'apee-router'
import { home } from './route/home'
import { checkLogin, login } from './route/login'
import { user } from './route/user'
import { loadTemplate } from './template'

export const router = new Router()
router.set(['home', 'add', 'list', 'tag', 'user', 'login'])
router.set('home', home)
router.set('login', login)
router.set('user', user)
router.start()
checkLogin()
loadTemplate(router)