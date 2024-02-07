import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.cookie('token', '', { maxAge: 0, httpOnly: true })
    res.redirect('/')
})

export default router