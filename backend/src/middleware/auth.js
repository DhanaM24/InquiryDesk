const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, role, name }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
};
