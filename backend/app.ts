import express, { NextFunction, Request, Response } from 'express'
import { getLocalIps } from './util'
import router from './router'
import { pool } from './util/db'

const port = process.argv[2] || 6790
express().use(router).use(express.json()).use((err: Error, _: Request, res: Response, __: NextFunction) => {
    res.status(500).send(err.message)
}).listen(port, () => getLocalIps().map(ip => console.log(`👉 http://${ip}:${port}`)))

process.on('exit', pool.end)
process.on('SIGINT', pool.end)