import ApeeRouter from 'apee-router'
import add from './route/add'
import home from './route/home'
import tag from './route/tag'
import { loadTemplate } from './template'

const router = new ApeeRouter()
router.set(['home', 'add', 'list', 'tag', 'user'])
router.set('home', home)
router.set('add', add)
router.set('tag', tag)
router.start()
loadTemplate(router)