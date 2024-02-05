import { Router } from 'express'
import login from './route/login'

const router = Router()

router.use('/api/login', login)

export default router