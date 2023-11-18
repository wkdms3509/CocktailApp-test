// import { createPool } from 'mysql2/promise'
const { createPool } = require('mysql2/promise')

const pool = createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
})
console.log(pool.host)

module.exports = { pool }
