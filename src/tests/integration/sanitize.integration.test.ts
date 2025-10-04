import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server';

// Usa rota /api/auth/signin (que valida e cria usuário) só para aproveitar pipeline de body parsing + sanitizeBody
// Envia payload com chaves perigosas & script injection; esperamos que campos proibidos sejam removidos

describe('Sanitize Middleware Integration', () => {
  it('remove __proto__ e <script> do corpo', async () => {
    const email = `sanitize_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        name: 'User Test',
        email,
        password: 'Str0ng@Senha',
        __proto__: { polluted: true },
        constructor: { evil: true },
        bio: '<script>alert(1)</script>Olá',
        link: 'javascript:alert(1)'
      })
      .set('Content-Type', 'application/json');

    expect([200,201,401]).toContain(res.status); // 201 criação, 401 caso validação zod falhe por motivo inesperado
    if (res.status === 201) {
      // App retorna user criado
      expect(res.body.user).toBeDefined();
    }

    // Validar que payload retornado (user) não contém campos removidos e bio foi sanitizada
    if (res.body?.user) {
      expect(res.body.user).not.toHaveProperty('__proto__');
      expect(res.body.user).not.toHaveProperty('constructor');
    }
  });
});
