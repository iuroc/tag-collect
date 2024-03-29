import { createPool, OkPacket, RowDataPacket } from 'mysql2/promise'
import { loadConfig } from '.'
import { hashSync } from 'bcrypt'

export const pool = createPool(loadConfig().mysql)

export const userExists = async (username: string) => {
    const [result] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as `count` FROM `user` WHERE `username` = ?', [username])
    return result[0].count > 0
}

export const createUser = async (username: string, password: string) => {
    const [result] = await pool.query<OkPacket>('INSERT INTO `user` (`username`, `password`) VALUES (?, ?)', [username, hashSync(password, 10)])
    return result.insertId
}