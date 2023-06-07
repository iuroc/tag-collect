import { Router } from 'apee-router'
import { home } from './route/home'
import { checkLogin, login } from './route/login'

export const router = new Router()
router.set(['home', 'add', 'list', 'tag', 'user', 'login'])
router.set('home', home)
router.set('login', login)
router.start()
checkLogin()