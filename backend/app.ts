import express, { NextFunction, Request, Response } from 'express'
import { getLocalIps, sendRes } from './util'
import router from './router'
import { pool } from './util/db'
import path from 'path'

const port = process.argv[2] || 6790
const app = express()
app.use(express.json())
app.use(router)
app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
    sendRes(res, false, err.message)
})
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')))
app.listen(port, () => getLocalIps().map(ip => console.log(`👉 http://${ip}:${port}`)))

process.on('exit', pool.end)
process.on('SIGINT', pool.end)