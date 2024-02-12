import { Router } from 'express'
import { checkJWTMiddleware, sendRes } from '../util'
import { pool } from '../util/db'
import { OkPacket, RowDataPacket } from 'mysql2/promise'

const router = Router()

router.post('/add', checkJWTMiddleware, async (req, res) => {
    try {
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
    } catch (error) {
        sendRes(res, false, '添加失败', error)
    }
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
    try {
        const userId = req['userId']
        const page = req.body.page || 0
        const pageSize = req.body.pageSize || 36
        const keyword = `%${(req.body.keyword as string || '').replace(/\s+/g, '%')}%`
        const tags = (req.body.tags || []) as string[]
        if (tags.length == 0) {
            const [result] = await pool.query<RowDataPacket[]>('SELECT `c`.`id`, `c`.`title`, `c`.`url`, `c`.`desc`, `c`.`create_time`, GROUP_CONCAT( `tag`.`text` SEPARATOR "{-}" ) AS `tags` FROM `collect` AS `c` JOIN `collect_tag` AS ct ON ct.`collect_id` = c.`id` JOIN `tag` ON ct.`tag_id` = tag.`id` WHERE `c`.`user_id` = ? GROUP BY `c`.`id` HAVING CONCAT( `c`.`title`, `c`.`desc`, `c`.`url`, `tags` ) LIKE ? ORDER BY `c`.`create_time` DESC LIMIT ? OFFSET ? ', [userId, keyword, pageSize, page * pageSize])
            for (const item of result) item.tags = item.tags.split('{-}')
            sendRes(res, true, '获取成功', result)
        } else {
            console.log(tags.join(','))
            const [result] = await pool.query<RowDataPacket[]>('SELECT c.`id`, c.`title`, c.`url`, c.`desc`, c.`create_time`, GROUP_CONCAT(t.`text` SEPARATOR "{-}") AS `tags` FROM `collect` c JOIN `collect_tag` ct ON c.`id` = ct.`collect_id` JOIN `tag` t ON ct.`tag_id` = t.`id` WHERE c.`user_id` = ? GROUP BY c.`id` HAVING EXISTS ( SELECT 1 FROM `collect_tag` ct2 JOIN `tag` t2 ON ct2.`tag_id` = t2.`id` WHERE ct2.`collect_id` = c.`id` AND t2.`text` IN (?) GROUP BY ct2.`collect_id` HAVING COUNT(DISTINCT t2.`text`) = ? ) ORDER BY c.`create_time` DESC LIMIT ? OFFSET ?', [userId, tags, tags.length, pageSize, page * pageSize])
            for (const item of result) item.tags = item.tags.split('{-}')
            sendRes(res, true, '获取成功', result)
        }
    } catch (error) {
        sendRes(res, false, '获取失败', error)
    }
})

const getCollectTags = async (collectId: number) => {
    const [result] = await pool.query<RowDataPacket[]>('SELECT `tag`.`text` FROM `collect_tag` LEFT JOIN `tag` ON `collect_tag`.`tag_id` = `tag`.`id` WHERE `collect_id` = ?', [collectId])
    return result.map(item => item.text)
}

router.post('/delete', checkJWTMiddleware, async (req, res) => {
    try {
        const collectId = req.body.collectId
        // 优先删除非外键表
        await pool.query('START TRANSACTION')
        await pool.query('DELETE FROM `collect_tag` WHERE `collect_id` = ?', [collectId])
        await pool.query('DELETE FROM `collect` WHERE `id` = ?', [collectId])
        await deleteTagsNotUsed()
        await pool.query('COMMIT')
        sendRes(res, true, '删除成功')
    } catch (error) {
        await pool.query('ROLLBACK')
        sendRes(res, false, '删除失败', error.message)
    }
})

router.post('/get', checkJWTMiddleware, async (req, res) => {
    try {
        const collectId = req.body.collectId
        const [result] = await pool.query<RowDataPacket[]>('SELECT `id`, `title`, `url`, `desc`, `create_time` FROM `collect` WHERE `id` = ?', [collectId])
        const tags = await getCollectTags(collectId)
        sendRes(res, true, '获取成功', { ...result[0], tags })
    } catch (error) {
        sendRes(res, false, '获取失败', error.message)
    }
})

router.post('/update', checkJWTMiddleware, async (req, res) => {
    try {
        const collectId = req.body.collectId
        const title = req.body.title
        const url = req.body.url
        const tags = req.body.tags
        const desc = req.body.desc
        await pool.query('START TRANSACTION')
        await pool.query<OkPacket>('UPDATE `collect` SET `title` = ?, `url` = ?, `desc` = ? WHERE `id` = ?', [title, url, desc, collectId])
        await pool.query<OkPacket>('DELETE FROM `collect_tag` WHERE `collect_id` = ?', [collectId])
        for (const tag of tags) {
            await pool.query<OkPacket>('INSERT INTO `collect_tag` (`collect_id`, `tag_id`) VALUES (?, ?)', [collectId, await getTagId(tag)])
        }
        await deleteTagsNotUsed()
        await pool.query('COMMIT')
        sendRes(res, true, '更新成功')
    } catch (error) {
        await pool.query('ROLLBACK')
        sendRes(res, false, '更新失败', error.message)
    }
})

/** 删除未使用的标签 */
const deleteTagsNotUsed = async () => {
    const [tagNoUsedResult] = await pool.query<RowDataPacket[]>('SELECT `id` FROM `tag` LEFT JOIN `collect_tag` ON `tag`.id = `collect_tag`.`tag_id` WHERE `collect_tag`.`tag_id` IS NULL')
    if (tagNoUsedResult.length > 0)
        await pool.query('DELETE FROM `tag` WHERE `id` IN (?)', [tagNoUsedResult.map(item => item.id)])
}

export default router