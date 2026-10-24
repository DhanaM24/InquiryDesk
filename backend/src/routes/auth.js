const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const db = require('../db');
const auth = require('../middleware/auth');
const httpError = require('../httpError');

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw httpError(422, 'Invalid input', parsed.error.flatten().fieldErrors);

    const { rows } = await db.query('SELECT * FROM users WHERE email=$1', [parsed.data.email]);
    const user = rows[0];
    const ok = user && (await bcrypt.compare(parsed.data.password, user.password_hash));
    if (!ok) throw httpError(401, 'Incorrect email or password');

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (e) { next(e); }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(204).end();
});

router.get('/me', auth, (req, res) => res.json(req.user));

module.exports = router;
