import { Router } from 'express'

const router = Router()

router.post('/', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    console.log(username, password)
})

export default router