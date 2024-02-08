import { Router } from 'express'
import { pool } from '../util/db'
import { checkJWT, loadConfig, sendRes } from '../util'
import { RowDataPacket } from 'mysql2/promise'
import { compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'

const router = Router()

router.post('/', async (req, res) => {
    const token = req.headers.cookie && req.headers.cookie.match(/token=([^;]+)/)[1]
    if (checkJWT(token)) return sendRes(res, true, '登录成功', { username: JSON.parse(atob(token.split('.')[1])).username })
    const username = req.body.username
    const password = req.body.password
    const connection = await pool.getConnection()
    const [result] = await pool.query<RowDataPacket[]>('SELECT `password` FROM `user` WHERE `username` = ?', [username])
    const passwordHash = result[0] && result[0].password
    connection.release()
    if (!passwordHash) return sendRes(res, false, '用户名或密码错误')
    if (compareSync(password, passwordHash)) {
        res.cookie('token', sign({ username }, loadConfig().jwtKey), { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true })
        sendRes(res, true, '登录成功', { username })
    } else {
        sendRes(res, false, '用户名或密码错误')
    }
})

export default router