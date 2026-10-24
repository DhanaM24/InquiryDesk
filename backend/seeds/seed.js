require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const hash = await bcrypt.hash('Password123!', 10);

  const users = [
    ['admin@demo.com', 'Admin User', 'admin'],
    ['staff1@demo.com', 'Staff One', 'staff'],
    ['staff2@demo.com', 'Staff Two', 'staff'],
  ];
  for (const [email, name, role] of users) {
    await pool.query(
      `INSERT INTO users (email, name, password_hash, role) VALUES ($1,$2,$3,$4)
       ON CONFLICT (email) DO NOTHING`,
      [email, name, hash, role]
    );
  }

  const { rows } = await pool.query(`SELECT id FROM users WHERE email='staff1@demo.com'`);
  const staff1 = rows[0].id;
  const samples = [
    ['Nimal Perera', 'nimal@example.com', 'Order delayed', 'My order #123 has not arrived after 10 days.'],
    ['Kamala Silva', '0771234567', 'Refund request', 'I would like a refund for a damaged item.'],
  ];
  for (const [c, ct, s, d] of samples) {
    await pool.query(
      `INSERT INTO inquiries (customer_name, contact, subject, description, created_by)
       VALUES ($1,$2,$3,$4,$5)`,
      [c, ct, s, d, staff1]
    );
  }
  console.log('Seed done. All passwords: Password123!');
  await pool.end();
})().catch((e) => { console.error(e); process.exit(1); });
