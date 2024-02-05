import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.send('登录成功')
})

export default router