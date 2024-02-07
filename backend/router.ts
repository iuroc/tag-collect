import { Router } from 'express'
import login from './api/login'
import logout from './api/logout'
import register from './api/register'
import { join } from 'path'

const router = Router()

router.get('/', (_, res) => {
    res.sendFile('index.html', { root: join(__dirname, '..', '..', 'frontend') })
})

router.use('/api/login', login)
router.use('/api/logout', logout)
router.use('/api/register', register)

export default router