require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const sql = fs.readFileSync(path.join(__dirname, '001_init.sql'), 'utf8');
  await pool.query(sql);
  console.log('Migration done');
  await pool.end();
})().catch((e) => { console.error(e); process.exit(1); });
