const router = require('express').Router();
const auth = require('../middleware/auth');
const svc = require('../services/inquiryService');
const schemas = require('../validation/inquirySchemas');
const httpError = require('../httpError');

router.use(auth); // every inquiry route requires a valid session

router.post('/', async (req, res, next) => {
  try {
    const parsed = schemas.createInquiry.safeParse(req.body);
    if (!parsed.success) throw httpError(422, 'Invalid input', parsed.error.flatten().fieldErrors);
    res.status(201).json(await svc.create(req.user, parsed.data));
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const { status, q } = req.query;
    if (status && !['new', 'in_progress', 'resolved'].includes(status)) {
      throw httpError(400, 'Invalid status filter');
    }
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    res.json(await svc.list(req.user, { status, q: q && String(q).trim(), page }));
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try { res.json(await svc.get(req.user, req.params.id)); } catch (e) { next(e); }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const parsed = schemas.changeStatus.safeParse(req.body);
    if (!parsed.success) throw httpError(422, 'Invalid input', parsed.error.flatten().fieldErrors);
    res.json(await svc.changeStatus(req.user, req.params.id, parsed.data.status, parsed.data.version));
  } catch (e) { next(e); }
});

module.exports = router;
