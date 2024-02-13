import { Router } from 'express'
import { checkJWTMiddleware, sendRes } from '../util'
import { pool } from '../util/db'
import { RowDataPacket } from 'mysql2/promise'

const router = Router()

router.get('/', checkJWTMiddleware, async (req, res) => {
    try {
        const userId = req['userId']
        const [result] = await pool.query<RowDataPacket[]>('SELECT `tag`.`text`, COUNT(*) as `count` FROM `collect_tag` JOIN `tag` ON `collect_tag`.`tag_id` = `tag`.`id` JOIN `collect` ON `collect`.`id` = `collect_tag`.`collect_id` WHERE `collect`.`user_id` = ? GROUP BY `tag_id` ORDER BY `count` DESC', [userId])
        sendRes(res, true, '获取标签成功', result)
    } catch (error) {
        sendRes(res, false, '获取标签失败', error)
    }
})

router.post('/cut', checkJWTMiddleware, (req, res) => {
    const text = req.body.text as string
    if (!text) return sendRes(res, false, '请输入文本内容')
    const segmenter = new Intl.Segmenter("zh", { granularity: "word" })
    const segments = segmenter.segment(text)
    sendRes(res, true, '获取标签成功', Array.from(segments).filter(item => item.isWordLike).map(item => item.segment))
})

export default router