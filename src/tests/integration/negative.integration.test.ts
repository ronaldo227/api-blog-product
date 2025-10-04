import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../server';
import { prisma } from '@/libs/prisma';

// Util para criar usuário base
async function ensureUser(email: string, password: string) {
  const existing = await prisma.user.findFirst({ where: { email } });
  if (!existing) {
    await request(app).post('/api/auth/signup').send({ name: 'User', email, password });
  }
}

describe('Negative Auth/Admin Scenarios', () => {
  const baseEmail = `neg_${Date.now()}@example.com`;
  const password = 'Str0ng@Senha1';
  let token: string | undefined;

  beforeAll(async () => {
    // Cria usuário válido
    const res = await request(app).post('/api/auth/signup').send({ name: 'Neg User', email: baseEmail, password });
    token = res.body.token;
  });

  it('signin com senha errada retorna 401', async () => {
    const res = await request(app).post('/api/auth/signin').send({ email: baseEmail, password: 'SenhaErrada!123' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error.code', 'AUTH_UNAUTHORIZED');
  });

  it('signup payload inválido retorna 400', async () => {
    const res = await request(app).post('/api/auth/signup').send({ email: 'sem_nome@example.com' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error.code', 'AUTH_INVALID_DATA');
  });

  it('admin sem token retorna 401', async () => {
    const res = await request(app).post('/api/admin/posts').send({ title: 'Post A', body: 'Conteudo' });
    expect(res.status).toBe(401);
    // privateRoute gera AUTH_UNAUTHORIZED para ausência de token
    expect(res.body).toHaveProperty('error.code', 'AUTH_UNAUTHORIZED');
  });

  it('admin slug duplicado retorna 201 com slug incrementado', async () => {
    // Usa token válido
    expect(token).toBeDefined();
    const authHeader = { Authorization: `Bearer ${token}` };
    const title = 'Título Único';
    // Primeiro cria
    const first = await request(app)
      .post('/api/admin/posts')
      .set(authHeader)
      .field('title', title)
      .field('body', 'Conteudo 1');
    expect(first.status).toBe(201);
    // Segunda criação gera slug diferente (incrementa sufixo)
    const second = await request(app)
      .post('/api/admin/posts')
      .set(authHeader)
      .field('title', title)
      .field('body', 'Conteudo 2');
    expect([201]).toContain(second.status);
    expect(second.body.slug).not.toBe(first.body.slug);
  }, 10000); // Timeout aumentado para 10s

  it('admin post sem title retorna 400', async () => {
    expect(token).toBeDefined();
    const res = await request(app)
      .post('/api/admin/posts')
      .set({ Authorization: `Bearer ${token}` })
      .field('body', 'Apenas body sem título');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error.code', 'ADMIN_POST_INVALID');
  });

  it('admin post sem body retorna 400', async () => {
    expect(token).toBeDefined();
    const res = await request(app)
      .post('/api/admin/posts')
      .set({ Authorization: `Bearer ${token}` })
      .field('title', 'Título Sem Body');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error.code', 'ADMIN_POST_INVALID');
  });
});
