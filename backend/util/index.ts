import { readFileSync } from 'fs'
import { networkInterfaces } from 'os'
import { join } from 'path'
import { Response } from 'express'

/**
 * 获取局域网 IP 地址
 * @param internal 是否包含内部地址
 * @returns IP 列表
 */
export const getLocalIps = (internal = true) => {
    const infos = Object.values(networkInterfaces())
    return infos.flat().filter(
        info => info.family == 'IPv4' && (internal ? true : !info.internal)
    ).map(info => info.address)
}

export const loadConfig = () => {
    const jsonStr = readFileSync(join(__dirname, '..', '..', '..', 'config.json')).toString()
    return JSON.parse(jsonStr) as {
        mysql: {
            host: string,
            port: number,
            user: string,
            password: string,
            database: string
        }
    }
}

export const sendRes = (res: Response, success: boolean, message: string, data = null) => {
    res.send({ success, message, data })
}