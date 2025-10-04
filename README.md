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

---

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

## 📦 Instalação

```bash
git clone https://github.com/ronaldo227/api-blog-product.git
cd api-blog-product

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env # Configure suas variáveis

# Configurar banco de dados
npx prisma migrate dev
npx prisma db seed

# Iniciar desenvolvimento
npm run dev
```

**O servidor estará rodando em `http://localhost:4444`**

---

## 📚 Scripts Disponíveis

### **Desenvolvimento**
```bash
npm run dev              # Servidor com hot-reload
npm run debug            # Debugger (porta 9229)
npm run debug:verbose    # Debug com logs detalhados
```

### **Logs Estruturados**
```bash
npm run logs:info        # Logs de produção (info level)
npm run logs:error       # Apenas erros 
npm run debug:verbose    # Debug detalhado para desenvolvimento
```

### **Testes**
```bash
npm test                 # Executa todos os testes
npm run test:watch       # Testes em modo watch
npm run test:coverage    # Relatório de cobertura
npm run test:unit        # Apenas testes unitários
npm run test:integration # Apenas testes de integração
```

### **Qualidade**
```bash
npm run lint             # Verifica erros TypeScript
npm run security:check   # Auditoria de segurança
npm run check            # Lint + Security check
```

### **Produção**
```bash
npm run build            # Compila TypeScript
npm run start            # Servidor compilado
```

### **Utilitários**
```bash
npm run health           # Status do servidor
npm run clean            # Limpa cache e build
npm run restart          # Reinicia servidor
```

---

## 🔧 Variáveis de Ambiente

Veja `.env.example` para todos os parâmetros necessários.

**Principais configurações:**
- `DATABASE_URL` - Conexão PostgreSQL
- `JWT_KEY` - Chave secreta (mín. 64 chars em produção)
- `ALLOWED_ORIGINS` - CORS origins
- `RATE_LIMIT_*` - Configuração de rate limiting

---

## 🔌 API Endpoints

### **Público**
```http
GET    /health              # Health check da API
GET    /api/posts           # Lista posts públicos
GET    /api/posts/:slug     # Detalhes de um post
```

### **Autenticação**
```http
POST   /api/auth/signup     # Registro de usuário
POST   /api/auth/signin     # Login (retorna JWT)
POST   /api/auth/validate   # Validar token JWT
```

### **Administração** (Requer JWT)
```http
POST   /api/admin/posts     # Criar post com upload
PUT    /api/admin/posts/:id # Atualizar post
DELETE /api/admin/posts/:id # Deletar post
```

**Documentação completa:** [Ver endpoints detalhados](./docs/ARCHITECTURE.md#endpoints)

---

## 🗂️ Estrutura do Projeto

```
api-blog-product/
├── src/
│   ├── config/          # Configurações e validação de ambiente
│   ├── controllers/     # Handlers de requisições HTTP
│   ├── libs/            # Bibliotecas configuradas (Prisma, JWT, Multer)
│   ├── middlewares/     # Pipeline de segurança e processamento
│   ├── routes/          # Definição de rotas por domínio
│   ├── schemas/         # Schemas de validação Zod
│   ├── services/        # Lógica de negócio e database access
│   ├── types/           # Tipos TypeScript customizados
│   ├── utils/           # Utilitários (logging, uploads, errors)
│   ├── tests/           # Testes unitários e de integração
│   └── server.ts        # Entry point da aplicação
├── prisma/
│   ├── schema.prisma    # Schema do banco de dados
│   ├── seed.ts          # Seed de dados
│   └── migrations/      # Migrações do banco
├── docs/                # Documentação técnica
└── uploads/             # Uploads de usuários (não versionado)
```

📖 **Cada diretório em `src/` possui seu próprio `README.md` detalhado.**

---

## ✅ Segurança Enterprise

- **🔒 Zero vulnerabilidades** detectadas (Snyk audit)
- **🛡️ Rate limiting** multi-camadas configurável
- **🧹 Input sanitization** contra XSS, Prototype Pollution, ReDoS
- **🔐 JWT Authentication** com refresh token strategy
- **📝 Request validation** com schemas Zod tipados
- **🚫 CORS restritivo** configurável por ambiente
- **📊 Security headers** Helmet + CSP customizado

---

## 🏗️ Arquitetura Técnica

### **Pipeline de Requisição**
```
HTTP Request → Trust Proxy → Request ID → Compression → 
CORS → Helmet → HTTP Logger → Rate Limiting → Body Parser → 
Sanitização → Routes → Controllers → Services → Database
```

### **Camadas Implementadas**
1. **Middlewares Globais** - Segurança e processamento
2. **Routes Layer** - Organização por domínio
3. **Controllers Layer** - Validação e response handling
4. **Services Layer** - Lógica de negócio e database access
5. **Database Layer** - PostgreSQL + Prisma ORM

📖 **Documentação detalhada:** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 🚀 Deploy & Produção

### **Checklist de Segurança**
- ✅ `JWT_KEY` com 64+ caracteres
- ✅ `DATABASE_URL` com SSL habilitado  
- ✅ `ALLOWED_ORIGINS` configurado
- ✅ Rate limiting ajustado para carga
- ✅ Logs em modo produção (sem debug)
- ✅ HTTPS configurado

### **Build e Deploy**
```bash
npm run build        # Compila TypeScript
npm run start        # Servidor produção
npm run health       # Verifica status
```

---

## 📊 Métricas e Qualidade

- **📈 Testes:** 20/20 passando (100%)
- **🔒 Segurança:** 0 vulnerabilidades
- **⚡ Performance:** <100ms resposta média
- **📦 Bundle:** 14 deps otimizadas
- **🧪 Coverage:** Unitário + Integração

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie branch (`git checkout -b feature/MinhaFeature`)
3. Commit (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push (`git push origin feature/MinhaFeature`)
5. Abra Pull Request

📖 **Guia completo:** [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📚 Documentação Completa

- 🏗️ **[Arquitetura](./docs/ARCHITECTURE.md)** - Design técnico detalhado
- 🔒 **[Segurança](./SECURITY_REPORT.md)** - Relatório de vulnerabilidades
- 📈 **[Status](./STATUS.md)** - Monitoramento do sistema
- 🔧 **[Melhorias](./MODERN-IMPROVEMENTS.md)** - Correções aplicadas
- 📝 **[Changelog](./CHANGELOG.md)** - Histórico de versões

---

## 👤 Autor

**Ronaldo Silva** - [@ronaldo227](https://github.com/ronaldo227)

**Projeto:** [api-blog-product](https://github.com/ronaldo227/api-blog-product)

---

## 📄 Licença

MIT License - Veja [LICENSE](./LICENSE) para detalhes.

---

⭐ **Se este projeto foi útil, considere dar uma estrela!**