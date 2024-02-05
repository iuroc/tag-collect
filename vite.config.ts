import { defineConfig } from 'vite'

export default defineConfig({
    root: './frontend',
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': 'http://127.0.0.1:6791'
        }
    }
})