import { Router } from 'express'
import user from './api/user'
import collect from './api/collect'
import { join } from 'path'
import tags from './api/tags'

const router = Router()

router.get('/', (_, res) => {
    res.sendFile('index.html', { root: join(__dirname, '..', '..', 'frontend', 'dist') })
})

router.use('/api/user', user)
router.use('/api/tags', tags)
router.use('/api/collect', collect)

export default router