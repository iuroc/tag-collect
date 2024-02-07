import { Router } from 'express'
import { sendRes } from '../util'
import { createUser, pool, userExists } from '../util/db'

const router = Router()

router.post('/', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const connection = await pool.getConnection()
    const ifExists = await userExists(connection, username)
    if (ifExists) return sendRes(res, false, '用户名已存在')
    const userId = createUser(connection, username, password)
    connection.release()
    sendRes(res, true, '注册成功', { userId })
})

export default router