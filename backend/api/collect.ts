import { Router } from 'express'
import { checkJWTMiddleware, sendRes } from '../util'
import { pool } from '../util/db'
import { OkPacket, RowDataPacket } from 'mysql2/promise'

const router = Router()

router.post('/add', checkJWTMiddleware, async (req, res) => {
    const userId = req['userId']
    const title = req.body.title
    const url = req.body.url
    const tags = req.body.tags
    const desc = req.body.desc
    const connection = await pool.getConnection()
    const [result] = await connection.query<OkPacket>('INSERT INTO `collect` (`title`, `url`, `desc`, `user_id`) VALUES (?, ?, ?, ?)', [title, url, desc, userId])
    const collectId = result.insertId
    for (const tag of tags) {
        await connection.query<OkPacket>('INSERT INTO `collect_tag` (`collect_id`, `tag_id`) VALUES (?, ?)', [collectId, await getTagId(tag)])
    }
    connection.release()
    sendRes(res, true, '添加成功', { id: collectId })
})

const getTagId = async (tag: string) => {
    const [result] = await pool.query<RowDataPacket[]>('SELECT `id` FROM `tag` WHERE `text` = ?', [tag])
    if (result.length == 0) {
        const [result] = await pool.query<OkPacket>('INSERT INTO `tag` (`text`) VALUES (?)', [tag])
        return result.insertId
    }
    return result[0].id
}

export default router