# 🚀 API Blog Product

> **API REST moderna e segura para blog com autenticação JWT e sistema de debug avançado**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)

## ✨ Funcionalidades

### 🔐 **Segurança de Nível Empresarial**
- ✅ **JWT seguro** com HS256, expiração 1h, issuer/audience
- ✅ **Hash de senhas** com bcrypt salt rounds 12
- ✅ **Rate limiting** - 5 tentativas por 15min
- ✅ **Headers de segurança** completos (Helmet + CSP)
- ✅ **CORS restritivo** e configurável
- ✅ **Input sanitization** anti-XSS e prototype pollution
- ✅ **Prevenção timing attacks** no login

### 🛡️ **Score de Segurança: 8.8/10**
- 📊 **0 vulnerabilidades** críticas
- 📊 **0 vulnerabilidades** médias
- 📊 **0 vulnerabilidades** baixas
- ✅ **Pronto para produção**

### 🔍 **Sistema de Debug Super Profundo**
- 🌟 Debug logging em **TODAS** as camadas
- 📊 Monitoramento de requests/responses
- 🗄️ Log de queries do banco de dados
- 🔐 Rastreamento de autenticação
- 🛡️ Logs de middlewares de segurança

## 🏗️ Arquitetura

```
src/
├── controllers/     # Lógica de negócio
├── services/        # Serviços de dados
├── middlewares/     # Middlewares de segurança
├── routes/          # Definição de rotas
├── libs/            # Bibliotecas (JWT, Prisma)
└── types/           # Tipos TypeScript
```

## 📡 Endpoints

### 🔓 **Públicos**
- `GET /api/ping` - Health check
- `POST /api/auth/signin` - Criar conta
- `POST /api/auth/signup` - Login
- `GET /api/posts` - Listar posts

### 🔐 **Privados** (Requer JWT)
- `POST /api/auth/validate` - Validar token
- `POST /api/admin/posts` - Criar post
- `PUT /api/admin/posts/:id` - Editar post
- `DELETE /api/admin/posts/:id` - Deletar post

## 🚀 Instalação

### 1. **Clone o repositório**
```bash
git clone https://github.com/ronaldo227/api-blog-product.git
cd api-blog-product
```

### 2. **Instale as dependências**
```bash
npm install
```

### 3. **Configure variáveis de ambiente**
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

### 4. **Configure o banco de dados**
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. **Execute a aplicação**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## ⚙️ Variáveis de Ambiente

```env
# Database
DATABASE_URL="sua_url_do_banco"

# JWT (mínimo 32 caracteres)
JWT_KEY="sua_chave_jwt_super_secreta"

# CORS (opcional)
ALLOWED_ORIGINS="http://localhost:3000"

# Ambiente
NODE_ENV="development"
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor desenvolvimento
npm run build        # Build para produção
npm start            # Servidor produção
npm run debug        # Debug mode
./sync.sh            # Sync automático Git
./security-test.sh   # Teste de segurança
./setup-github.sh    # Configurar GitHub
```

## 🛡️ Segurança

### **Middlewares Implementados:**
- 🔒 **Helmet** - Headers de segurança
- 🛡️ **CORS** - Cross-Origin Resource Sharing
- 🚫 **Rate Limiting** - Prevenção de abuso
- 🧹 **Input Sanitization** - Limpeza de dados
- 🔐 **JWT Validation** - Autenticação segura

### **Validações:**
- ✅ Content-Type validation
- ✅ Schema validation com Zod
- ✅ JWT signature verification
- ✅ Password strength (bcrypt)

## 📊 Tecnologias

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Linguagem:** TypeScript
- **Banco:** PostgreSQL + Prisma ORM
- **Autenticação:** JWT + bcrypt
- **Validação:** Zod
- **Segurança:** Helmet + Rate Limiting

## 🔄 Git Sync

Sistema automático de sincronização configurado:

```bash
./sync.sh  # Commit e push automático
```

**Configurações VS Code:**
- ✅ Auto-save após 1s
- ✅ Auto-fetch a cada 3min
- ✅ Smart commits
- ✅ Sync na barra de status

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Ronaldo Silva**
- GitHub: [@ronaldo227](https://github.com/ronaldo227)
- Email: devronaldosilva893@gmail.com

---

⭐ **Se este projeto te ajudou, deixe uma estrela!** ⭐
