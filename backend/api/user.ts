import { Router } from 'express'
import { checkJWT, loadConfig, sendRes } from '../util'
import { compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { RowDataPacket } from 'mysql2/promise'
import { createUser, pool, userExists } from '../util/db'

const router = Router()

router.get('/logout', (req, res) => {
    res.cookie('token', '', { maxAge: 0, httpOnly: true })
    res.redirect('/')
})

router.post('/login', async (req, res) => {
    const token = req.headers.cookie && req.headers.cookie.match(/token=([^;]+)/)[1]
    if (checkJWT(token)) return sendRes(res, true, '登录成功')
    const username = req.body.username
    const password = req.body.password
    const connection = await pool.getConnection()
    const [result] = await pool.query<RowDataPacket[]>('SELECT `id`, `password` FROM `user` WHERE `username` = ?', [username])
    const passwordHash = result[0] && result[0].password
    const userId = result[0] && result[0].id
    connection.release()
    if (!passwordHash) return sendRes(res, false, '用户名或密码错误')
    if (compareSync(password, passwordHash)) {
        res.cookie('token', sign({ userId }, loadConfig().jwtKey), { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true })
        sendRes(res, true, '登录成功')
    } else {
        sendRes(res, false, '用户名或密码错误')
    }
})

router.post('/register', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const connection = await pool.getConnection()
    const ifExists = await userExists(connection, username)
    if (ifExists) {
        connection.release()
        return sendRes(res, false, '用户名已存在')
    }
    const userId = createUser(connection, username, password)
    connection.release()
    sendRes(res, true, '注册成功', { userId })
})


export default router