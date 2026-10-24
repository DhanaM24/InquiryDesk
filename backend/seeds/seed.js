require("dotenv").config();

const bcrypt = require("bcrypt");
const { pool } = require("../src/db");

async function seed() {
  const staffHash = await bcrypt.hash("staff123", 10);
  const adminHash = await bcrypt.hash("admin123", 10);

  await pool.query("DELETE FROM inquiries");
  await pool.query("DELETE FROM users");

  const users = await pool.query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, 'staff'), ($3, $4, 'admin')
     RETURNING id, email, role`,
    ["staff@inquirydesk.local", staffHash, "admin@inquirydesk.local", adminHash]
  );

  const staff = users.rows.find((row) => row.role === "staff");
  const admin = users.rows.find((row) => row.role === "admin");

  await pool.query(
    `INSERT INTO inquiries
      (created_by, customer_name, contact, subject, description, status)
     VALUES
      ($1, 'Priya Fernando', 'priya@example.com', 'Billing question',
       'Invoice total looks higher than quoted.', 'new'),
      ($2, 'Nimal Perera', '0771234567', 'Service delay',
       'Technician did not arrive on the booked date.', 'in_progress')`,
    [staff.id, admin.id]
  );

  await pool.end();
  console.log("Seeded users:");
  console.log("  staff@inquirydesk.local / staff123 (staff)");
  console.log("  admin@inquirydesk.local / admin123 (admin)");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
