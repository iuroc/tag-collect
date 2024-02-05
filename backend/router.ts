import { Router } from 'express'
import login from './route/login'
import { join } from 'path'

const router = Router()

router.get('/', (_, res) => {
    res.sendFile('index.html', { root: join(__dirname, '..', '..', 'frontend') })
})

router.use('/api/login', login)

export default router