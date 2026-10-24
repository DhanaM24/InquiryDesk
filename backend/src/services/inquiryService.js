const db = require('../db');
const httpError = require('../httpError');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Allowed lifecycle transitions
const ALLOWED = {
  new: ['in_progress'],
  in_progress: ['resolved'],
  resolved: ['in_progress'], // reopen
};

const toDto = (r) => ({
  id: r.id,
  customerName: r.customer_name,
  contact: r.contact,
  subject: r.subject,
  description: r.description,
  status: r.status,
  createdBy: r.created_by,
  version: r.version,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

// ACCESS RULE lives in one place: admin sees all, staff see only their own.
async function getAccessible(user, id) {
  if (!UUID_RE.test(id)) throw httpError(400, 'Invalid inquiry id');
  const { rows } =
    user.role === 'admin'
      ? await db.query('SELECT * FROM inquiries WHERE id=$1', [id])
      : await db.query('SELECT * FROM inquiries WHERE id=$1 AND created_by=$2', [id, user.id]);
  if (!rows[0]) throw httpError(404, 'Inquiry not found'); // 404 also for forbidden: don't leak existence
  return rows[0];
}

async function create(user, data) {
  // Duplicate policy: same creator + contact + subject within 10 minutes
  const dup = await db.query(
    `SELECT id FROM inquiries
     WHERE created_by=$1 AND lower(contact)=lower($2) AND lower(subject)=lower($3)
       AND created_at > now() - interval '10 minutes'
     LIMIT 1`,
    [user.id, data.contact, data.subject]
  );
  if (dup.rows[0]) {
    throw httpError(409, 'A similar inquiry was just submitted', { existingId: dup.rows[0].id });
  }
  const { rows } = await db.query(
    `INSERT INTO inquiries (customer_name, contact, subject, description, created_by)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [data.customerName, data.contact, data.subject, data.description, user.id]
  );
  return toDto(rows[0]);
}

async function list(user, { status, q, page = 1, pageSize = 10 }) {
  const params = [];
  const where = [];
  if (user.role !== 'admin') { params.push(user.id); where.push(`created_by=$${params.length}`); }
  if (status) { params.push(status); where.push(`status=$${params.length}`); }
  if (q) {
    params.push(`%${q}%`);
    where.push(`(customer_name ILIKE $${params.length} OR subject ILIKE $${params.length} OR contact ILIKE $${params.length})`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const count = await db.query(`SELECT count(*)::int AS total FROM inquiries ${whereSql}`, params);

  params.push(pageSize, (page - 1) * pageSize);
  const { rows } = await db.query(
    `SELECT * FROM inquiries ${whereSql}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return { items: rows.map(toDto), total: count.rows[0].total, page, pageSize };
}

async function get(user, id) {
  return toDto(await getAccessible(user, id));
}

async function changeStatus(user, id, status, version) {
  const inq = await getAccessible(user, id);
  if (!ALLOWED[inq.status].includes(status)) {
    throw httpError(409, `Cannot change status from "${inq.status}" to "${status}"`);
  }
  // Optimistic concurrency: only update if the version still matches
  const { rows } = await db.query(
    `UPDATE inquiries SET status=$1, version=version+1, updated_at=now()
     WHERE id=$2 AND version=$3 RETURNING *`,
    [status, id, version]
  );
  if (!rows[0]) {
    throw httpError(409, 'This inquiry was updated elsewhere. Please reload.', { stale: true });
  }
  return toDto(rows[0]);
}

module.exports = { create, list, get, changeStatus, ALLOWED };
