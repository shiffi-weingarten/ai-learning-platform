import request from 'supertest';
import app from '../index';
import prisma from '../prisma';

beforeAll(async () => {
  // Clean test data
  await prisma.prompt.deleteMany({ where: { user: { phone: '1111111111' } } });
  await prisma.user.deleteMany({ where: { phone: '1111111111' } });
});

afterAll(async () => {
  await prisma.prompt.deleteMany({ where: { user: { phone: '1111111111' } } });
  await prisma.user.deleteMany({ where: { phone: '1111111111' } });
  await prisma.$disconnect();
});

describe('Auth', () => {
  it('POST /api/auth/register - should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      phone: '1111111111',
      password: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body.user.phone).toBe('1111111111');
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/register - should reject duplicate phone', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      phone: '1111111111',
      password: 'password123',
    });
    expect(res.status).toBe(409);
  });

  it('POST /api/auth/login - should login successfully', async () => {
    const res = await request(app).post('/api/auth/login').send({
      phone: '1111111111',
      password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/login - should reject wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      phone: '1111111111',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });
});

describe('Categories', () => {
  it('GET /api/categories - should return categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('subCategories');
  });
});

describe('Prompts', () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/login').send({
      phone: '1111111111',
      password: 'password123',
    });
    token = res.body.token;
  });

  it('POST /api/prompts - should require auth', async () => {
    const res = await request(app).post('/api/prompts').send({
      categoryId: 1,
      subCategoryId: 1,
      prompt: 'Test prompt',
    });
    expect(res.status).toBe(401);
  });

  it('GET /api/prompts/history - should return empty history', async () => {
    const res = await request(app)
      .get('/api/prompts/history')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Admin', () => {
  it('GET /api/admin/users - should reject non-admin', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      phone: '1111111111',
      password: 'password123',
    });
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${loginRes.body.token}`);
    expect(res.status).toBe(403);
  });

  it('GET /api/admin/users - should work for admin', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      phone: '0000000000',
      password: 'admin123',
    });
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${loginRes.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});
