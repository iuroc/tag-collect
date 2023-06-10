import { Router } from 'apee-router'
import { home } from './route/home'
import { checkLogin, login } from './route/login'
import { user } from './route/user'
import { add } from './route/add'
import { list } from './route/list'
import { loadTemplate } from './template'

export const router = new Router()
router.set(['home', 'add', 'list', 'tag', 'user', 'login'])
router.set('home', home)
router.set('login', login)
router.set('user', user)
router.set('add', add)
router.set('list', list)
checkLogin()
loadTemplate(router)
router.start()