# Utils: Funções Utilitárias e Helpers

Funções auxiliares para logging, processamento de uploads, tratamento de erros e outras tarefas comuns.

## 📁 Arquivos

### `uploads.ts` - Processamento Seguro de Imagens

**Funcionalidades:**
- `processCover()` - Processa upload de imagem com Sharp
- `ensureUploadDirs()` - Garante estrutura de diretórios
- `MIME_EXTENSION` - Mapeamento seguro de MIME types

**Pipeline de Segurança:**
```
1. Upload Multer (temp/) → UUID temporário
2. Validação MIME + extensão
3. Sharp re-encoding → Remove EXIF/payloads
4. Redimensionamento (max 1600px)
5. Salvar em covers/ → UUID final
6. Limpar arquivo temp
```

**Exemplo de Uso:**
```typescript
import { processCover } from '@/utils/uploads';

const result = await processCover({ 
  file: req.file, 
  reencode: true,
  maxWidth: 1600 
});

console.log(result);
// {
//   publicPath: '/uploads/covers/abc-123.jpg',
//   finalPath: 'uploads/covers/abc-123.jpg',
//   filename: 'abc-123.jpg'
// }
```

**Segurança:**
- ✅ **EXIF Removal**: Remove metadados que podem conter exploits
- ✅ **Polyglot Prevention**: Re-codificação elimina payloads ocultos
- ✅ **Path Traversal**: UUID impede `../../etc/passwd`
- ✅ **Storage Abuse**: Redimensiona para evitar uploads gigantes

**MIME Types Permitidos:**
```typescript
{
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif'
}
```

### `http-error.ts` - Respostas de Erro Padronizadas

**Funcionalidade:**
- `sendError()` - Formata e envia erros HTTP com logging

**Interface:**
```typescript
interface HttpErrorOptions {
  status: number;        // HTTP status (400, 401, 500...)
  code: string;          // Código interno estável
  message: string;       // Mensagem em português
  details?: any;         // Detalhes de validação
  logLevel?: 'warn' | 'error' | 'info';
  context?: Record<string, any>;
}
```

**Exemplo de Uso:**
```typescript
import { sendError } from '@/utils/http-error';

// Erro de autenticação
sendError(res, {
  status: 401,
  code: 'AUTH_INVALID_CREDENTIALS',
  message: 'Email ou senha inválidos'
});

// Erro de validação
sendError(res, {
  status: 400,
  code: 'VALIDATION_ERROR',
  message: 'Dados inválidos',
  details: { field: 'email', error: 'Email já cadastrado' }
});
```

**Formato de Resposta:**
```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Email ou senha inválidos",
    "timestamp": "2025-10-04T18:00:00.000Z"
  }
}
```

**Códigos Internos Padronizados:**
| Código | Status | Descrição |
|--------|--------|-----------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Credenciais inválidas |
| `AUTH_UNAUTHORIZED` | 401 | Token ausente/inválido |
| `VALIDATION_ERROR` | 400 | Entrada inválida (Zod) |
| `CONFLICT` | 409 | Recurso duplicado |
| `NOT_FOUND` | 404 | Recurso não existe |
| `RATE_LIMIT_EXCEEDED` | 429 | Muitas requisições |
| `INTERNAL_ERROR` | 500 | Erro não tratado |

**Logging Automático:**
```typescript
// 5xx → level: 'error'
// 4xx → level: 'warn'
// Customizável via logLevel
```

### `logger-modern.ts` - Logging Estruturado (Winston)

**Funcionalidades:**
- Logs estruturados em JSON
- Múltiplos níveis (error, warn, info, debug)
- Timestamps ISO 8601
- Rotação de arquivos (em produção)

**Uso:**
```typescript
import { AppLogger } from '@/utils/logger-modern';

AppLogger.info('Usuário criado', { userId: 123, email: 'user@example.com' });
AppLogger.warn('Taxa de erro alta', { errorRate: 0.05 });
AppLogger.error('Falha no banco', { error: err.message, stack: err.stack });
```

**Output em Desenvolvimento:**
```
2025-10-04T18:00:00.000Z [INFO]: Usuário criado {"userId":123,"email":"user@example.com"}
```

**Output em Produção (JSON):**
```json
{
  "timestamp": "2025-10-04T18:00:00.000Z",
  "level": "info",
  "message": "Usuário criado",
  "userId": 123,
  "email": "user@example.com"
}
```

### `logger.ts` - Debug Customizado

**Uso:**
```typescript
import { Logger } from '@/utils/logger';

Logger.info('server', 'Servidor iniciado', { port: 4444 });
Logger.error('database', 'Conexão falhou', { error: 'ETIMEDOUT' });
```

**Habilitação:**
```bash
DEBUG=api:* npm run dev
```

## 🔒 Segurança no Processamento de Upload

### Ataques Prevenidos

**1. Polyglot Files**
Arquivos que são válidos em múltiplos formatos (ex: JPEG + PHP).

**Defesa:**
```typescript
await sharp(tempPath)
  .rotate() // Remove orientação EXIF
  .resize({ width: maxWidth, withoutEnlargement: true })
  .jpeg({ quality: 82 }) // Re-codifica forçadamente
  .toFile(finalPath);
```

**2. EXIF Exploits**
Metadados EXIF podem conter shellcode ou informações sensíveis.

**Defesa:**
Sharp remove automaticamente todos os metadados durante re-encoding.

**3. Path Traversal**
Upload com nome `../../etc/passwd` pode sobrescrever arquivos.

**Defesa:**
```typescript
const uuid = crypto.randomUUID(); // abc-123-def-456
const filename = `${uuid}${ext}`; // abc-123.jpg
```

**4. Storage Exhaustion**
Upload de imagens 100MB pode esgotar disco.

**Defesa:**
```typescript
.resize({ width: 1600, withoutEnlargement: true })
.jpeg({ quality: 82 }) // Compressão agressiva
```

## 🧪 Testes

Testes em `src/tests/unit/uploads.processCover.test.ts`:
- ✅ Processa JPEG válido
- ✅ Retorna publicPath correto
- ✅ Remove arquivo temp após processamento
- ✅ Redimensiona imagens grandes

## 📚 Referências

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Winston Logger](https://github.com/winstonjs/winston)
- [OWASP File Upload](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)
