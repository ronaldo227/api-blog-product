import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../server';
import { prisma } from '@/libs/prisma';

/**
 * Testes de integração para fluxo de autenticação.
 * Assumem DATABASE_URL apontando para um banco de teste isolado.
 * Usuários criados são truncados ao final.
 */

describe('Auth Integration', () => {
  const testUser = {
    name: 'Teste User',
    email: `test_user_${Date.now()}@example.com`,
    password: 'Str0ng@Senha'
  };
  let token: string | null = null;

  let dbAvailable = true;

  beforeAll(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      await prisma.user.deleteMany({ where: { email: testUser.email } });
    } catch (e) {
      dbAvailable = false;
      // Silenciar erro esperado quando DB não está disponível em ambiente de CI sem banco
    }
  });

  beforeEach(function () {
    if (!dbAvailable) {
      // @ts-ignore
      this.skip();
    }
  });

  afterAll(async () => {
    if (dbAvailable) {
      await prisma.user.deleteMany({ where: { email: testUser.email } });
      await prisma.$disconnect();
    }
  });

  it('POST /api/auth/signup cria usuário e retorna token (201)', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/auth/signup com email duplicado retorna 409', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(409);
  });

  it('POST /api/auth/signin autentica usuário existente e retorna token (200)', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: testUser.email, password: testUser.password })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('POST /api/auth/validate sem token retorna 401', async () => {
    const res = await request(app)
      .post('/api/auth/validate')
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(401);
  });

  it('POST /api/auth/validate com token válido retorna valid=true', async () => {
    expect(token).toBeTruthy();
    const res = await request(app)
      .post('/api/auth/validate')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('valid', true);
    expect(res.body).toHaveProperty('user.email', testUser.email);
  });
});
