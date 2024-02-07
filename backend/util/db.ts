import { createPool } from 'mysql2/promise'
import { loadConfig } from '.'

export const pool = createPool(loadConfig().mysql)