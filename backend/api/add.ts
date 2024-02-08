import { Router } from 'express'
import { checkJWTMiddleware } from '../util'

const router = Router()

router.post('/', checkJWTMiddleware, async (req, res) => {
    
})

export default router