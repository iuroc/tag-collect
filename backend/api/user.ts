import { Router } from 'express'
import { checkJWT, checkJWTMiddleware, loadConfig, sendRes } from '../util'
import { compareSync, hashSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { RowDataPacket } from 'mysql2/promise'
import { createUser, pool, userExists } from '../util/db'

const router = Router()

router.get('/logout', (_, res) => {
    res.clearCookie('token')
    res.redirect('/')
})

router.post('/login', async (req, res) => {
    try {
        const token = req.headers.cookie && req.headers.cookie.match(/token=([^;]+)/)[1]
        if (checkJWT(token)) return sendRes(res, true, '登录成功')
        const username = req.body.username
        const password = req.body.password
        const [result] = await pool.query<RowDataPacket[]>('SELECT `id`, `password` FROM `user` WHERE `username` = ?', [username])
        const passwordHash = result[0] && result[0].password
        const userId = result[0] && result[0].id
        if (!passwordHash) return sendRes(res, false, '用户名或密码错误')
        if (compareSync(password, passwordHash)) {
            res.cookie('token', sign({ userId }, loadConfig().jwtKey), { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true })
            sendRes(res, true, '登录成功')
        } else {
            sendRes(res, false, '用户名或密码错误')
        }
    } catch (error) {
        sendRes(res, false, '服务器错误')
    }
})

router.post('/register', async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const ifExists = await userExists(username)
        if (ifExists) {
            return sendRes(res, false, '用户名已存在')
        }
        await createUser(username, password)
        sendRes(res, true, '注册成功')
    } catch (error) {
        sendRes(res, false, '服务器错误')
    }
})

router.post('/resetPassword', checkJWTMiddleware, async (req, res) => {
    const newPassword = req.body.password
    const userId = req['userId']
    const passwordHash = hashSync(newPassword, 10)
    await pool.query('UPDATE `user` SET `password` = ? WHERE `id` = ?', [passwordHash, userId])
    sendRes(res, true, '修改成功')
})

export default router