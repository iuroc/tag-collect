import { readFileSync } from 'fs'
import { networkInterfaces } from 'os'
import { join } from 'path'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

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
        },
        jwtKey: string
    }
}

export const sendRes = (res: Response, success: boolean, message: string, data = null) => {
    res.send({ success, message, data })
}

/** 用于校验 JWT 的中间件，可通过 `req['userId']` 获取用户 ID */
export const checkJWTMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.cookie && req.headers.cookie.match(/token=([^;]+)/)[1]
    if (checkJWT(token)) {
        req['userId'] = JSON.parse(atob(token.split('.')[1])).userId
        next()
    }
    else sendRes(res, false, '请先登录')
}

/** 校验 JWT */
export const checkJWT = (token: string) => {
    try {
        verify(token, loadConfig().jwtKey)
        return true
    } catch (err) {
        return false
    }
}