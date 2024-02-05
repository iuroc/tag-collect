import express from 'express'
import { getLocalIps } from './util'
import router from './router'

const app = express()

app.use(router)

const port = process.argv[2] || 6790

app.listen(port, () => {
    getLocalIps().map(ip => console.log(`👉 http://${ip}:${port}`))
})