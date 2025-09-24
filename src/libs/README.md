# Libs: Bibliotecas Utilitárias Customizadas

Esta pasta contém bibliotecas utilitárias criadas para uso interno do projeto, como JWT, integração com Prisma e upload de arquivos.

## Principais arquivos
- `jwt.ts`: Criação e verificação de tokens JWT com validações de segurança.
- `prisma.ts`: Instância singleton do Prisma Client para acesso ao banco.
- `multer.ts`: Configuração de upload de arquivos (imagens) com validação de tipo e tamanho.

## Exemplos de uso
```typescript
// JWT
import { createJWT, verifyJWT } from '../libs/jwt';
const token = createJWT({ userId: 1 });
const payload = verifyJWT(token);

// Prisma
import { prisma } from '../libs/prisma';
const users = await prisma.user.findMany();

// Multer (em uma rota)
import { upload } from '../libs/multer';
router.post('/upload', upload.single('file'), controller.uploadFile);
```

## Boas práticas
- Centralize integrações externas e utilitários nesta pasta.
- Não coloque lógica de negócio aqui, apenas utilidades reutilizáveis.
- Documente funções utilitárias complexas neste README.

---
Consulte este README para exemplos e padrões antes de criar novas libs customizadas.
