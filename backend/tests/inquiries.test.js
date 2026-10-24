require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

const login = async (email) => {
  const agent = request.agent(app);
  await agent.post('/api/auth/login').send({ email, password: 'Password123!' }).expect(200);
  return agent;
};

afterAll(() => db.end());

test("staff cannot read another staff member's inquiry (404)", async () => {
  const staff1 = await login('staff1@demo.com');
  const staff2 = await login('staff2@demo.com');

  const created = await staff1.post('/api/inquiries').send({
    customerName: 'Test Customer',
    contact: `test${Date.now()}@example.com`,
    subject: 'Access test',
    description: 'Checking the access rule works.',
  }).expect(201);

  await staff2.get(`/api/inquiries/${created.body.id}`).expect(404);
  await staff1.get(`/api/inquiries/${created.body.id}`).expect(200);
});

test('invalid transition new -> resolved returns 409', async () => {
  const staff1 = await login('staff1@demo.com');
  const created = await staff1.post('/api/inquiries').send({
    customerName: 'Test Customer',
    contact: `test${Date.now()}@example.com`,
    subject: 'Transition test',
    description: 'Checking the transition rule works.',
  }).expect(201);

  const res = await staff1
    .patch(`/api/inquiries/${created.body.id}/status`)
    .send({ status: 'resolved', version: created.body.version })
    .expect(409);
  expect(res.body.error).toMatch(/Cannot change status/);
});

test('unauthenticated request returns 401', async () => {
  await request(app).get('/api/inquiries').expect(401);
});
