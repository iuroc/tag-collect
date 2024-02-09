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
    const [result] = await pool.query<OkPacket>('INSERT INTO `collect` (`title`, `url`, `desc`, `user_id`) VALUES (?, ?, ?, ?)', [title, url, desc, userId])
    const collectId = result.insertId
    for (const tag of tags) {
        await pool.query<OkPacket>('INSERT INTO `collect_tag` (`collect_id`, `tag_id`) VALUES (?, ?)', [collectId, await getTagId(tag)])
    }
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

router.post('/list', checkJWTMiddleware, async (req, res) => {
    const userId = req['userId']
    const page = req.body.page || 0
    const pageSize = req.body.pageSize || 36
    const [result] = await pool.query<RowDataPacket[]>('SELECT `id`, `title`, `url`, `desc` FROM `collect` WHERE `user_id` = ? LIMIT ? OFFSET ?', [userId, pageSize, page * pageSize])
    for (const item of result) item.tags = await getCollectTags(item.id)
    sendRes(res, true, '获取成功', result)
})

const getCollectTags = async (collectId: number) => {
    const [result] = await pool.query<RowDataPacket[]>('SELECT `tag`.`text` FROM `collect_tag` LEFT JOIN `tag` ON `collect_tag`.`tag_id` = `tag`.`id` WHERE `collect_id` = ?', [collectId])
    return result.map(item => item.text)
}

router.post('/delete', checkJWTMiddleware, async (req, res) => {
    try {
        const collectId = req.body.collectId
        await pool.query('START TRANSACTION')
        await pool.query('DELETE FROM `collect` WHERE `id` = ?', [collectId])
        await pool.query('DELETE FROM `collect_tag` WHERE `collect_id` = ?', [collectId])
        const [tagNoUsedResult] = await pool.query<RowDataPacket[]>('SELECT `id` FROM `tag` JOIN `collect_tag` ON `tag`.id = `collect_tag`.`tag_id` WHERE `collect_tag`.`tag_id` IS NULL')
        if (tagNoUsedResult.length > 0)
            await pool.query('DELETE FROM `tag` WHERE `id` IN (?)', [tagNoUsedResult.map(item => item.id)])
        await pool.query('COMMIT')
        sendRes(res, true, '删除成功')
    } catch (error) {
        await pool.query('ROLLBACK')
        sendRes(res, false, '删除失败', error.message)
    }
})

export default router