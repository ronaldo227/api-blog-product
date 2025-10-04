# Libs: Bibliotecas Configuradas 📚# Libs: Bibliotecas Utilitárias Customizadas



Wrappers e configurações de bibliotecas externas (Prisma, JWT, Multer).Esta pasta contém bibliotecas utilitárias criadas para uso interno do projeto, como JWT, integração com Prisma e upload de arquivos.



## 📁 Estrutura## Principais arquivos

- `jwt.ts`: Criação e verificação de tokens JWT com validações de segurança.

```- `prisma.ts`: Instância singleton do Prisma Client para acesso ao banco.

libs/- `multer.ts`: Configuração de upload de arquivos (imagens) com validação de tipo e tamanho.

├── prisma.ts       # Cliente Prisma ORM configurado

├── jwt.ts          # Geração e verificação de tokens JWT## Exemplos de uso

└── multer.ts       # Upload de arquivos com validação```typescript

```// JWT

import { createJWT, verifyJWT } from '../libs/jwt';

## 🎯 Responsabilidadesconst token = createJWT({ userId: 1 });

const payload = verifyJWT(token);

Abstrair configurações complexas de bibliotecas em módulos reutilizáveis.

// Prisma

---import { prisma } from '../libs/prisma';

const users = await prisma.user.findMany();

## 📄 Arquivos

// Multer (em uma rota)

### `prisma.ts` - Cliente do Bancoimport { upload } from '../libs/multer';

router.post('/upload', upload.single('file'), controller.uploadFile);

Cliente Prisma ORM singleton com log queries em desenvolvimento.```



**Uso:**## Boas práticas

```typescript- Centralize integrações externas e utilitários nesta pasta.

import { prisma } from '@/libs/prisma';- Não coloque lógica de negócio aqui, apenas utilidades reutilizáveis.

- Documente funções utilitárias complexas neste README.

// Buscar usuário

const user = await prisma.user.findUnique({---

  where: { email: 'user@example.com' }Consulte este README para exemplos e padrões antes de criar novas libs customizadas.

});

// Criar post
const post = await prisma.post.create({
  data: {
    title: 'Título',
    body: 'Conteúdo',
    userId: 1
  }
});
```

**Configuração:**
- Log de queries em development (`NODE_ENV=development`)
- Timeout de 5 segundos
- Connection pooling automático

**Migrations:**
```bash
# Criar migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations
npx prisma migrate deploy

# Abrir Prisma Studio
npx prisma studio
```

---

### `jwt.ts` - JSON Web Tokens

Geração e verificação de tokens JWT com configuração centralizada.

#### Funções

##### `signToken(userId: number): string`
Gera token JWT assinado.

**Uso:**
```typescript
import { signToken } from '@/libs/jwt';

const token = signToken(user.id);
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Payload:**
```json
{
  "userId": 123,
  "iat": 1696435200,
  "exp": 1696521600
}
```

**Configuração:**
- Algoritmo: HS256
- Secret: `process.env.JWT_KEY`
- TTL: `process.env.JWT_TTL` (default: 1h)

##### `verifyToken(token: string): JwtPayload`
Verifica e decodifica token JWT.

**Uso:**
```typescript
import { verifyToken } from '@/libs/jwt';

try {
  const payload = verifyToken(token);
  console.log(payload.userId); // 123
} catch (error) {
  // Token inválido ou expirado
  console.error('Token inválido');
}
```

**Erros possíveis:**
- `TokenExpiredError` - Token expirado
- `JsonWebTokenError` - Token inválido/malformado
- `NotBeforeError` - Token usado antes do tempo

**Segurança:**
- Sempre use HTTPS em produção
- JWT_KEY com ≥64 caracteres
- TTL curto (1h-24h recomendado)

---

### `multer.ts` - Upload de Arquivos

Configuração segura de upload com Multer.

**Uso:**
```typescript
import { upload } from '@/libs/multer';
import { Router } from 'express';

const router = Router();

// Upload único
router.post('/posts', upload.single('cover'), async (req, res) => {
  if (req.file) {
    console.log(req.file.filename); // abc123-uuid.jpg
    console.log(req.file.path);     // uploads/abc123-uuid.jpg
  }
  
  res.json({ uploaded: !!req.file });
});
```

**Configuração:**

#### Armazenamento
- **Destino:** `uploads/` (criado automaticamente)
- **Filename:** UUID + extensão original
- **Exemplo:** `a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg`

#### Validações

##### Tipos MIME Aceitos
```typescript
const allowedMimes = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
];
```

##### Limites
- **Tamanho máximo:** 5 MB por arquivo
- **Campos:** 10 campos de texto
- **Arquivos:** 1 arquivo por request

**Validação Dupla:**
1. MIME type (Content-Type do browser)
2. Extensão do arquivo (.jpg, .png, .webp)

**Segurança:**
- ✅ UUID previne path traversal
- ✅ Validação MIME previne upload de executáveis
- ✅ Limite de tamanho previne DoS
- ✅ Extensão validada (não confia apenas no MIME)

**Erros:**
```typescript
// Arquivo muito grande
{ error: 'Arquivo muito grande. Máximo: 5MB' }

// Tipo não permitido
{ error: 'Tipo de arquivo não permitido. Use: jpg, png, webp' }

// Muitos campos
{ error: 'Muitos campos no formulário' }
```

---

## 🔒 Segurança

### JWT
1. **Secret forte:** ≥64 caracteres em produção
2. **TTL curto:** 1h-24h máximo
3. **HTTPS:** Sempre em produção
4. **Rotação:** Rotacionar secret periodicamente

### Upload
1. **Whitelist MIME:** Apenas imagens permitidas
2. **Limite de tamanho:** 5MB máximo
3. **UUID:** Previne sobrescrita/path traversal
4. **Processamento:** Sharp remove EXIF malicioso (ver `utils/uploads.ts`)

### Prisma
1. **Connection pooling:** Gerenciado automaticamente
2. **Prepared statements:** Previne SQL injection
3. **SSL:** Use em produção (`DATABASE_URL?sslmode=require`)

---

## 🧪 Testes

### JWT
```typescript
import { signToken, verifyToken } from '@/libs/jwt';

describe('JWT', () => {
  it('should sign and verify token', () => {
    const token = signToken(123);
    const payload = verifyToken(token);
    
    expect(payload.userId).toBe(123);
  });
  
  it('should reject invalid token', () => {
    expect(() => verifyToken('invalid')).toThrow();
  });
});
```

### Multer
```typescript
import request from 'supertest';
import { app } from '@/server';

describe('Upload', () => {
  it('should upload valid image', async () => {
    const response = await request(app)
      .post('/api/admin/posts')
      .attach('cover', 'tests/fixtures/image.jpg');
    
    expect(response.status).toBe(201);
  });
  
  it('should reject large file', async () => {
    const response = await request(app)
      .post('/api/admin/posts')
      .attach('cover', 'tests/fixtures/large.jpg'); // > 5MB
    
    expect(response.status).toBe(400);
  });
});
```

---

## 📚 Referências

- [Prisma Documentation](https://www.prisma.io/docs)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [Multer](https://github.com/expressjs/multer)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
