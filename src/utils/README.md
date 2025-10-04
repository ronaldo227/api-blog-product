# Utils: Utilitários 🛠️# Utils: Funções Utilitárias e Helpers



Funções auxiliares reutilizáveis para operações comuns.Funções auxiliares para logging, processamento de uploads, tratamento de erros e outras tarefas comuns.



## 📁 Estrutura## 📁 Arquivos



```### `uploads.ts` - Processamento Seguro de Imagens

utils/

├── http-error.ts       # Helper para erros HTTP padronizados**Funcionalidades:**

├── logger.ts           # Logger estruturado (Winston)- `processCover()` - Processa upload de imagem com Sharp

├── logger-modern.ts    # Logger moderno (Express 5)- `ensureUploadDirs()` - Garante estrutura de diretórios

└── uploads.ts          # Processamento de uploads de imagem- `MIME_EXTENSION` - Mapeamento seguro de MIME types

```

**Pipeline de Segurança:**

---```

1. Upload Multer (temp/) → UUID temporário

## 📄 Arquivos2. Validação MIME + extensão

3. Sharp re-encoding → Remove EXIF/payloads

### `http-error.ts` - Erros HTTP4. Redimensionamento (max 1600px)

5. Salvar em covers/ → UUID final

Helper para retornar erros HTTP padronizados com logging.6. Limpar arquivo temp

```

#### Função

**Exemplo de Uso:**

##### `httpError(res, status, message, code?)````typescript

Retorna erro HTTP formatado e loga.import { processCover } from '@/utils/uploads';



**Uso:**const result = await processCover({ 

```typescript  file: req.file, 

import { httpError } from '@/utils/http-error';  reencode: true,

  maxWidth: 1600 

export const getPost = async (req: Request, res: Response) => {});

  const post = await findPostBySlug(req.params.slug);

  console.log(result);

  if (!post) {// {

    return httpError(res, 404, 'Post não encontrado', 'POST_NOT_FOUND');//   publicPath: '/uploads/covers/abc-123.jpg',

  }//   finalPath: 'uploads/covers/abc-123.jpg',

  //   filename: 'abc-123.jpg'

  res.json(post);// }

};```

```

**Segurança:**

**Response:**- ✅ **EXIF Removal**: Remove metadados que podem conter exploits

```json- ✅ **Polyglot Prevention**: Re-codificação elimina payloads ocultos

{- ✅ **Path Traversal**: UUID impede `../../etc/passwd`

  "error": "Post não encontrado",- ✅ **Storage Abuse**: Redimensiona para evitar uploads gigantes

  "code": "POST_NOT_FOUND",

  "timestamp": "2025-10-04T18:30:00Z"**MIME Types Permitidos:**

}```typescript

```{

  'image/jpeg': '.jpg',

**Códigos Comuns:**  'image/png': '.png',

- `AUTH_UNAUTHORIZED` (401)  'image/gif': '.gif'

- `AUTH_FORBIDDEN` (403)}

- `NOT_FOUND` (404)```

- `DUPLICATE_RESOURCE` (409)

- `INTERNAL_ERROR` (500)### `http-error.ts` - Respostas de Erro Padronizadas



---**Funcionalidade:**

- `sendError()` - Formata e envia erros HTTP com logging

### `logger.ts` / `logger-modern.ts` - Logging

**Interface:**

Logger estruturado com Winston para logs organizados.```typescript

interface HttpErrorOptions {

#### Uso  status: number;        // HTTP status (400, 401, 500...)

  code: string;          // Código interno estável

##### Info  message: string;       // Mensagem em português

```typescript  details?: any;         // Detalhes de validação

import { logger } from '@/utils/logger';  logLevel?: 'warn' | 'error' | 'info';

  context?: Record<string, any>;

logger.info('User authenticated', {}

  userId: 123,```

  email: 'user@example.com'

});**Exemplo de Uso:**

``````typescript

import { sendError } from '@/utils/http-error';

##### Error

```typescript// Erro de autenticação

logger.error('Failed to create post', {sendError(res, {

  userId: 123,  status: 401,

  error: error.message,  code: 'AUTH_INVALID_CREDENTIALS',

  stack: error.stack  message: 'Email ou senha inválidos'

});});

```

// Erro de validação

##### DebugsendError(res, {

```typescript  status: 400,

logger.debug('Database query', {  code: 'VALIDATION_ERROR',

  query: 'SELECT * FROM posts',  message: 'Dados inválidos',

  duration: 15  details: { field: 'email', error: 'Email já cadastrado' }

});});

``````



**Níveis:****Formato de Resposta:**

- `error` - Erros críticos```json

- `warn` - Avisos{

- `info` - Informações gerais  "error": {

- `debug` - Detalhes de debug    "code": "AUTH_INVALID_CREDENTIALS",

    "message": "Email ou senha inválidos",

**Formato:**    "timestamp": "2025-10-04T18:00:00.000Z"

```json  }

{}

  "level": "info",```

  "message": "User authenticated",

  "userId": 123,**Códigos Internos Padronizados:**

  "email": "user@example.com",| Código | Status | Descrição |

  "timestamp": "2025-10-04T18:30:00.000Z"|--------|--------|-----------|

}| `AUTH_INVALID_CREDENTIALS` | 401 | Credenciais inválidas |

```| `AUTH_UNAUTHORIZED` | 401 | Token ausente/inválido |

| `VALIDATION_ERROR` | 400 | Entrada inválida (Zod) |

**Produção:**| `CONFLICT` | 409 | Recurso duplicado |

```bash| `NOT_FOUND` | 404 | Recurso não existe |

LOG_LEVEL=info  # Não use debug em produção| `RATE_LIMIT_EXCEEDED` | 429 | Muitas requisições |

```| `INTERNAL_ERROR` | 500 | Erro não tratado |



---**Logging Automático:**

```typescript

### `uploads.ts` - Processamento de Imagens// 5xx → level: 'error'

// 4xx → level: 'warn'

Processamento seguro de uploads de imagem com Sharp.// Customizável via logLevel

```

#### Função

### `logger-modern.ts` - Logging Estruturado (Winston)

##### `processCover(file): Promise<ProcessedUpload>`

Processa imagem: remove EXIF, redimensiona, converte para WebP.**Funcionalidades:**

- Logs estruturados em JSON

**Uso:**- Múltiplos níveis (error, warn, info, debug)

```typescript- Timestamps ISO 8601

import { processCover } from '@/utils/uploads';- Rotação de arquivos (em produção)



export const addPost = async (req: ExtendedRequest, res: Response) => {**Uso:**

  let coverPath: string | undefined;```typescript

  import { AppLogger } from '@/utils/logger-modern';

  if (req.file) {

    const result = await processCover({ file: req.file });AppLogger.info('Usuário criado', { userId: 123, email: 'user@example.com' });

    coverPath = result.publicPath;AppLogger.warn('Taxa de erro alta', { errorRate: 0.05 });

  }AppLogger.error('Falha no banco', { error: err.message, stack: err.stack });

  ```

  const post = await createPost({

    ...req.body,**Output em Desenvolvimento:**

    cover: coverPath,```

    userId: req.userId!.id2025-10-04T18:00:00.000Z [INFO]: Usuário criado {"userId":123,"email":"user@example.com"}

  });```

  

  res.status(201).json(post);**Output em Produção (JSON):**

};```json

```{

  "timestamp": "2025-10-04T18:00:00.000Z",

**Processo:**  "level": "info",

```  "message": "Usuário criado",

1. Recebe arquivo do Multer  "userId": 123,

2. Remove metadados EXIF (privacidade/segurança)  "email": "user@example.com"

3. Redimensiona (max 1200x1200, mantém aspect ratio)}

4. Converte para WebP (compressão 80%)```

5. Gera UUID como nome

6. Salva em uploads/### `logger.ts` - Debug Customizado

7. Retorna path público

```**Uso:**

```typescript

**Input:**import { Logger } from '@/utils/logger';

```typescript

{Logger.info('server', 'Servidor iniciado', { port: 4444 });

  file: Express.Multer.FileLogger.error('database', 'Conexão falhou', { error: 'ETIMEDOUT' });

}```

```

**Habilitação:**

**Output:**```bash

```typescriptDEBUG=api:* npm run dev

{```

  filename: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890.webp',

  filepath: '/home/user/app/uploads/a1b2c3d4...webp',## 🔒 Segurança no Processamento de Upload

  publicPath: '/uploads/a1b2c3d4...webp',

  size: 45678### Ataques Prevenidos

}

```**1. Polyglot Files**

Arquivos que são válidos em múltiplos formatos (ex: JPEG + PHP).

**Segurança:**

- ✅ Remove EXIF (pode conter localização, device info)**Defesa:**

- ✅ Remove possíveis payloads em metadados```typescript

- ✅ Redimensiona (previne DoS com imagens gigantes)await sharp(tempPath)

- ✅ UUID previne path traversal  .rotate() // Remove orientação EXIF

- ✅ WebP reduz tamanho (melhor performance)  .resize({ width: maxWidth, withoutEnlargement: true })

  .jpeg({ quality: 82 }) // Re-codifica forçadamente

**Limites:**  .toFile(finalPath);

- Tamanho entrada: até 5MB (validado no Multer)```

- Tamanho saída: redimensionado para max 1200x1200px

- Formatos aceitos: jpg, png, webp**2. EXIF Exploits**

Metadados EXIF podem conter shellcode ou informações sensíveis.

---

**Defesa:**

## 🔒 SegurançaSharp remove automaticamente todos os metadados durante re-encoding.



### HTTP Errors**3. Path Traversal**

- Não vaze detalhes de implementaçãoUpload com nome `../../etc/passwd` pode sobrescrever arquivos.

- Use códigos genéricos para o cliente

- Logue detalhes internos**Defesa:**

```typescript

**❌ Ruim:**const uuid = crypto.randomUUID(); // abc-123-def-456

```typescriptconst filename = `${uuid}${ext}`; // abc-123.jpg

res.status(500).json({```

  error: 'Prisma query failed: P2002 unique constraint on email'

});**4. Storage Exhaustion**

```Upload de imagens 100MB pode esgotar disco.



**✅ Bom:****Defesa:**

```typescript```typescript

httpError(res, 409, 'Email já cadastrado', 'DUPLICATE_EMAIL');.resize({ width: 1600, withoutEnlargement: true })

// Logs internos contêm detalhes do Prisma.jpeg({ quality: 82 }) // Compressão agressiva

``````



### Uploads## 🧪 Testes

- Sempre processe com Sharp (remove payloads)

- Nunca confie em extensão fornecidaTestes em `src/tests/unit/uploads.processCover.test.ts`:

- Valide MIME type- ✅ Processa JPEG válido

- Use UUID para nomes- ✅ Retorna publicPath correto

- ✅ Remove arquivo temp após processamento

---- ✅ Redimensiona imagens grandes



## 🧪 Testes## 📚 Referências



### HTTP Error- [Sharp Documentation](https://sharp.pixelplumbing.com/)

```typescript- [Winston Logger](https://github.com/winstonjs/winston)

import { httpError } from '@/utils/http-error';- [OWASP File Upload](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)


describe('httpError', () => {
  it('should return formatted error', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    httpError(res as any, 404, 'Not found', 'NOT_FOUND');
    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Not found',
        code: 'NOT_FOUND'
      })
    );
  });
});
```

### Upload Processing
```typescript
import { processCover } from '@/utils/uploads';
import fs from 'fs';

describe('processCover', () => {
  it('should process image and remove EXIF', async () => {
    const mockFile = {
      filename: 'test.jpg',
      path: '/tmp/test.jpg'
    } as Express.Multer.File;
    
    const result = await processCover({ file: mockFile });
    
    expect(result.filename).toMatch(/\.webp$/);
    expect(result.publicPath).toMatch(/^\/uploads\//);
    expect(fs.existsSync(result.filepath)).toBe(true);
  });
});
```

---

## 📚 Boas Práticas

1. **Logging estruturado**: Use objetos, não strings
2. **Não logue senhas/tokens**: Dados sensíveis
3. **HTTP errors consistentes**: Sempre mesmo formato
4. **Processe uploads**: Nunca salve direto
5. **UUID para arquivos**: Previne conflitos
6. **Limpe arquivos temporários**: Não deixe lixo

### Exemplo de Log Estruturado
```typescript
// ❌ Log não estruturado
logger.info(`User ${userId} created post ${postId}`);

// ✅ Log estruturado (fácil de query)
logger.info('Post created', {
  userId,
  postId,
  title: post.title
});
```

---

## 🔗 Referências

- [Winston Logger](https://github.com/winstonjs/winston)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [EXIF Security Risks](https://en.wikipedia.org/wiki/Exif#Privacy_and_security)
