import { Router } from 'express'
import { checkJWTMiddleware, sendRes } from '../util'
import { pool } from '../util/db'
import { RowDataPacket } from 'mysql2/promise'

const router = Router()

router.get('/', checkJWTMiddleware, async (req, res) => {
    const connection = await pool.getConnection()
    const [result] = await connection.query<RowDataPacket[]>('SELECT `tag`.`text`, COUNT(*) as `count` FROM `collect_tag` JOIN `tag` ON `collect_tag`.`tag_id` = `tag`.`id` GROUP BY `tag_id` ORDER BY `count` DESC')
    sendRes(res, true, '获取标签成功', result)
    connection.release()
})

export default router