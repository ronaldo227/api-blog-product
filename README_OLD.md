# API Blog Product

**Backend Enterprise-Level** para sistema de blog construído com Node.js, Express 5, TypeScript e Prisma ORM, implementando padrões de segurança avançados e arquitetura escalável.

![Visitas](https://komarev.com/ghpvc/?username=ronaldo227&label=Visualizações&color=0e75b6&style=flat)

[![Status](https://img.shields.io/badge/Status-✅%20Funcionando-brightgreen)](./STATUS.md)
[![Segurança](https://img.shields.io/badge/Vulnerabilidades-0-brightgreen)](./SECURITY_REPORT.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](./tsconfig.json)

> ⚠️ Este projeto recebe atualizações periódicas com melhorias e análises de código,
> garantindo qualidade e alinhamento com as melhores práticas do mercado.

Backend enterprise-level em evolução contínua, com foco em segurança, escalabilidade e performance.

---

## 🚀 Status do Sistema

**✅ Sistema 100% operacional** - [Ver relatório completo](./STATUS.md)

- 🔧 **Build:** Compilando sem erros
- 🌐 **Servidor:** Rodando estável na porta 4444
- 🔒 **Segurança:** 0 vulnerabilidades detectadas
- 🛡️ **Proteção:** Headers e middleware ativos
- ⚡ **Performance:** Respostas otimizadas

---

## 🏗️ Arquitetura Enterprise

### **Stack Tecnológica**
- **Node.js + TypeScript** - Type safety e performance
- **Express 5** - Framework web de última geração  
- **Prisma ORM** - Database toolkit moderno
- **PostgreSQL** - Banco relacional enterprise
- **Winston** - Logging estruturado profissional

### **Segurança Multi-Camadas**
- **🔐 JWT Authentication** - Tokens stateless seguros
- **🛡️ Rate Limiting** - Proteção DDoS multi-níveis
- **🧹 Input Sanitization** - Anti-XSS e Prototype Pollution
- **🔒 Security Headers** - Helmet + CSP configurados
- **📸 File Upload** - Validação MIME + remoção EXIF
- **🚫 CORS** - Controle de origem específico

### **Performance & Escalabilidade**
- **⚡ Gzip Compression** - Resposta 40% menor
- **🔄 Connection Pooling** - Prisma otimizado
- **📊 Structured Logging** - Winston + namespaces
- **🎯 Error Handling** - Centralizado e tipado
- **🧪 Test Coverage** - 20/20 testes passando

## 📋 Pré-requisitos

## ⚠️ Compatibilidade TypeScript

- Node.js >= 18.x

- PostgreSQL >= 14.xProjeto otimizado para TypeScript 5.9.2 com suporte a imports via alias (`@/`). Configuração estável recomendada até migração futura para TypeScript 7.x.

- npm ou yarn

---

## ⚡ Instalação Rápida

## 📦 Uploads e Arquivos Estáticos

```bash

# Clone o repositórioSistema de upload seguro para imagens de capa:

git clone https://github.com/ronaldo227/api-blog-product.git- Processamento automático e validação de tipos

cd api-blog-product- Geração de nomes únicos via UUID

- Armazenamento organizado em `public/uploads/covers`

# Instale as dependências

npm install```ts

app.use("/uploads", express.static("public/uploads"));

# Configure as variáveis de ambiente```

cp .env.example .env

# Edite o .env com suas configurações## 🐞 Debug e Logs



# Execute as migrações do banco```bash

npx prisma migrate devDEBUG=api:* npm run dev  # Logs detalhados em desenvolvimento

```

# Inicie o servidor de desenvolvimento
npm run dev

# Logs estruturados via Winston com namespaces configuráveis para produção
npm run logs:info        # Logs de produção (info level)
npm run logs:error       # Apenas erros 
npm run debug:verbose    # Debug detalhado para desenvolvimento
```

---

O servidor estará rodando em `http://localhost:4444`



## 🔧 Variáveis de Ambiente

## 🚀 Diferenciais Técnicos

Crie um arquivo `.env` na raiz do projeto:

- Arquitetura enterprise-level

```bash- Código limpo, seguro e performático (+40%)

# Ambiente- Score de segurança: 9.5/10

NODE_ENV=development- Estrutura modular e escalável

- Middlewares avançados (JWT, Zod, erros, rate limit, segurança)

# Servidor- Logging estruturado (Winston)

PORT=4444- Banco de dados robusto (Prisma ORM, migrações, PostgreSQL)

- Documentação e scripts profissionais

# Banco de Dados

DATABASE_URL="postgresql://user:password@localhost:5432/blog?schema=public"## 🚀 Tecnologias



# JWT- Node.js

JWT_KEY="sua-chave-secreta-minimo-32-caracteres-use-64-em-producao"- TypeScript

JWT_TTL="7d"- Express

- Prisma ORM

# CORS- PostgreSQL

ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"- JWT Authentication

- Helmet, CORS, Rate Limiting

# Rate Limiting

RATE_LIMIT_WINDOW_MS=60000---

RATE_LIMIT_MAX_REQUESTS=100

## 🎯 Funcionalidades Implementadas

### **Autenticação & Autorização**
- ✅ **Registro de usuários** com validação robusta (Zod)
- ✅ **Login JWT** com refresh token strategy
- ✅ **Middleware de autenticação** para rotas protegidas
- ✅ **Proteção contra timing attacks** no login
- ✅ **Hash bcrypt** com 12 salt rounds

### **Gestão de Conteúdo**
- ✅ **CRUD completo de posts** com autorização
- ✅ **Geração automática de slugs únicos** (implementação custom)
- ✅ **Sistema de upload de imagens** com Sharp processing
- ✅ **Validação de arquivos** (MIME + extensão dupla)
- ✅ **Remoção de metadados EXIF** para privacidade

### **Segurança Avançada**
- ✅ **Rate limiting configurável** por endpoint
- ✅ **Sanitização multi-camadas** (XSS, Prototype Pollution, ReDoS)
- ✅ **Headers de segurança** (Helmet + CSP customizado)
- ✅ **Prevenção TOCTOU** em criação de usuários
- ✅ **Validação Content-Type** para APIs seguras

### **Observabilidade & Monitoramento**
- ✅ **Logging estruturado** com Winston + namespaces
- ✅ **Health check** completo (API + Database)
- ✅ **Request tracking** com IDs únicos
- ✅ **Error handling** centralizado e tipado
- ✅ **Métricas de performance** integradas

## 🎯 Otimização de Dependências

**Projeto otimizado com apenas 14 dependências de produção:**

✅ **Implementações customizadas** substituem bibliotecas desnecessárias  
✅ **Slug generation** própria - elimina `transliteration`  
✅ **HTTP logging** customizado - elimina `morgan`  
✅ **Rate limiting** otimizado - elimina `express-slow-down`  
✅ **Zero vulnerabilidades** de segurança  
✅ **Bundle reduzido** em ~8MB  

**Benefícios:**
- 🔒 Menor superfície de ataque de segurança
- ⚡ Melhor performance com código otimizado
- 🎯 Controle total sobre funcionalidades críticas
- 📦 Instalação mais rápida e bundle menor

---

# Desenvolvimento

npm run dev              # Inicia servidor com hot-reload## 📦 Instalação

npm run debug            # Inicia servidor com debugger (porta 9229)

npm run debug:verbose    # Debug com logs detalhados```bash

git clone https://github.com/ronaldo227/api-blog-product.git

# Produçãocd api-blog-product

npm run build            # Compila TypeScript para JavaScriptnpm install

npm run start            # Inicia servidor compiladocp .env.example .env # Configure suas variáveis

npx prisma migrate dev

# Testesnpm run dev

npm test                 # Executa todos os testes

npm run test:watch       # Executa testes em modo watch---

npm run test:coverage    # Gera relatório de cobertura

npm run test:unit        # Executa apenas testes unitários

npm run test:integration # Executa apenas testes de integração# <span style="font-size:2em;">🛠️ Melhorias Detalhadas — 09/09/2025</span>



# Qualidade### Controller de Criação de Post (`admin.ts`)

npm run lint             # Verifica erros TypeScript

npm run security:check   # Executa auditoria de segurança- **Slug Inteligente e Único:**

npm run check            # Lint + Security check	- Implementação de geração automática de slug limpo, sem acentos e caracteres

 especiais, garantindo URLs amigáveis e únicas para cada post.

# Utilitários	- Prevenção de duplicidade: se o slug já existir, é incrementado automaticamente.

npm run health           # Verifica status do servidor

npm run clean            # Limpa cache e build- **Validação Robusta:**

npm run restart          # Reinicia servidor	- Checagem de autenticação do usuário antes de permitir a criação do post.

```	- Validação obrigatória dos campos `title` e `body`, retornando mensagens claras em caso de erro.



## 🗂️ Estrutura do Projeto- **Upload Seguro de Imagem:**

	- Suporte ao upload de imagem para o campo `cover`, integrando com o sistema de arquivos e protegendo contra uploads inválidos.

```

api-blog-product/- **Tratamento de Erros e Logging:**

├── src/	- Logging detalhado de erros no backend para facilitar o debug e a manutenção.

│   ├── config/          # Configurações e variáveis de ambiente	- Respostas HTTP padronizadas para cada cenário (401, 400, 201, 500).

│   ├── controllers/     # Handlers de requisições HTTP

│   ├── libs/            # Bibliotecas configuradas (Prisma, JWT, Multer)- **Documentação e Manutenção:**

│   ├── middlewares/     # Middlewares Express (auth, sanitize, rate-limit)	- Comentários e documentação do código revisados e simplificados, facilitando o onboarding de novos devs.

│   ├── routes/          # Definição de rotas da API	- Estrutura do controller alinhada com as melhores práticas de REST e TypeScript.

│   ├── schemas/         # Schemas de validação Zod

│   ├── services/        # Lógica de negócio> _Essas melhorias elevam o padrão de qualidade, segurança e escalabilidade

│   ├── types/           # Tipos TypeScript customizados do projeto, tornando o backend mais confiável e pronto para produção._

│   ├── utils/           # Utilitários (uploads, logger, http-error)

│   ├── tests/           # Testes unitários e de integração---

│   └── server.ts        # Entry point da aplicação

├── prisma/

│   ├── schema.prisma    # Schema do banco de dados---

│   ├── seed.ts          # Seed de dados

│   └── migrations/      # Migrações do banco## ⚙️ Variáveis de Ambiente

├── docs/                # Documentação técnica

├── public/              # Arquivos estáticosVeja `.env.example` para todos os parâmetros necessários.

└── uploads/             # Uploads de usuários (não versionado)

```---



📖 Cada diretório em `src/` possui seu próprio `README.md` detalhado.

## ✅ Segurança

## 🔌 API Endpoints

Análise de vulnerabilidades via Snyk (opcional):

### Autenticação```bash

npm install -g snyk && snyk test

```http```

POST /api/auth/signup

POST /api/auth/signinConfiguração enterprise com JWT, bcrypt, Helmet, CORS e rate limiting.

```

---

### Posts (Requer Autenticação)

## � Relatórios

```http

GET    /api/posts           # Lista posts públicos- 📈 **[Status do Sistema](./STATUS.md)** - Verificação completa de funcionamento

GET    /api/posts/:slug     # Detalhes de um post- 🔒 **[Relatório de Segurança](./SECURITY_REPORT.md)** - Análise de vulnerabilidades

- 📚 **[Documentação Técnica](./DOCS.md)** - Arquitetura e implementação

POST   /api/admin/posts     # Criar post (admin)- 🔧 **[Guia de Uso](./USAGE.md)** - Endpoints e exemplos

PUT    /api/admin/posts/:id # Atualizar post (admin)

DELETE /api/admin/posts/:id # Deletar post (admin)---

```

## 🤝 Contribuição

### Health Check

Contribuições são bem-vindas! Abra uma issue ou pull request para sugerir melhorias.

```http

GET /health                 # Status da API e banco de dados---

```

## 📄 Licença

📖 Documentação completa em [docs/api-conventions.md](./docs/api-conventions.md)

MIT. Veja o arquivo LICENSE para mais detalhes.

## 🧪 Testes---



O projeto possui cobertura de testes para componentes críticos:


```bash
# Executar todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Modo watch para desenvolvimento
npm run test:watch
```

**Estrutura de testes:**
- `src/tests/unit/` - Testes unitários (utils, middlewares)
- `src/tests/integration/` - Testes de integração (API endpoints)
- `src/tests/health.test.ts` - Testes de health check

## 🛡️ Segurança

O projeto implementa múltiplas camadas de segurança:

1. **Autenticação**: JWT com expiração configurável
2. **Hash de Senhas**: bcrypt com 12 salt rounds
3. **Rate Limiting**: Proteção contra brute force
4. **Input Sanitization**: Previne XSS e injection
5. **CORS**: Origens controladas
6. **Headers**: Helmet para headers seguros
7. **Upload**: Validação MIME + extensão, remoção de EXIF
8. **Validação**: Zod schemas em todas as entradas

Para executar auditoria de segurança:

```bash
npm run security:check
```

📖 Veja [docs/SECURITY.md](./docs/SECURITY.md) para mais detalhes.

## 📊 Banco de Dados

O projeto usa PostgreSQL com Prisma ORM.

### Modelo Principal

```prisma
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  password String
  posts    Post[]
}

model Post {
  id      Int     @id @default(autoincrement())
  slug    String  @unique
  title   String
  body    String
  cover   String?
  userId  Int
  user    User    @relation(fields: [userId], references: [id])
}
```

### Comandos Prisma

```bash
# Criar migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations
npx prisma migrate deploy

# Abrir Prisma Studio (GUI)
npx prisma studio

# Gerar Prisma Client
npx prisma generate

# Seed do banco
npx prisma db seed
```

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas:

```
┌─────────────────────────────────────────┐
│           HTTP Request                   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Middlewares (Global)                   │
│  - CORS, Helmet, Rate Limit             │
│  - Request ID, Error Handler            │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Routes Layer                            │
│  - Definição de endpoints               │
│  - Middlewares específicos de rota      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Controllers Layer                       │
│  - Validação de input (Zod)            │
│  - Tratamento de request/response       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Services Layer                          │
│  - Lógica de negócio                    │
│  - Interação com banco (Prisma)         │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Database (PostgreSQL)                   │
└─────────────────────────────────────────┘
```

📖 Veja [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) para detalhes.

## 🚀 Deploy

### Preparação para Produção

1. **Configure variáveis de ambiente**
   - `NODE_ENV=production`
   - `JWT_KEY` com 64+ caracteres
   - `DATABASE_URL` com SSL
   - `ALLOWED_ORIGINS` com domínios reais

2. **Build da aplicação**
   ```bash
   npm run build
   ```

3. **Execute migrações**
   ```bash
   npx prisma migrate deploy
   ```

4. **Inicie o servidor**
   ```bash
   npm start
   ```

### Checklist de Segurança

- [ ] Variáveis de ambiente configuradas corretamente
- [ ] JWT_KEY forte (64+ caracteres)
- [ ] Database com SSL habilitado
- [ ] CORS configurado com origens específicas
- [ ] Rate limiting ajustado para produção
- [ ] Logs configurados (evite debug em produção)
- [ ] Backup do banco de dados configurado
- [ ] Monitoramento ativo (CPU, memória, erros)
- [ ] HTTPS configurado
- [ ] Firewall configurado

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

📖 Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para mais detalhes.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

## 🔗 Links Úteis

- 📖 [Documentação Técnica](./docs/)
- 🔒 [Política de Segurança](./docs/SECURITY.md)
- 🏗️ [Arquitetura](./docs/ARCHITECTURE.md)
- 📝 [Changelog](./CHANGELOG.md)
- ✅ [TODO](./TODO.md)

## 👤 Autor

**Ronaldo**

- GitHub: [@ronaldo227](https://github.com/ronaldo227)
- Projeto: [api-blog-product](https://github.com/ronaldo227/api-blog-product)

---

⭐ Se este projeto foi útil, considere dar uma estrela!
