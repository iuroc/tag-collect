import { Router } from 'express'
import { pool } from '../util/db'

const router = Router()

router.get('/', async (req, res) => {
    res.send('登录成功')
    const connection = await pool.getConnection()
    console.log(connection.query('SHOW TABLES'))
    connection.release()
})

export default router