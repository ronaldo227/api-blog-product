# 🚀 API Blog Product - Versão Moderna

> **API REST enterprise-level com práticas modernas de desenvolvimento, segurança avançada e logging estruturado**

![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-9.5%2F10-green?style=for-the-badge)
![Modern](https://img.shields.io/badge/Code-Modern%20Practices-blue?style=for-the-badge)
[![GitHub License](https://img.shields.io/github/license/ronaldo227/api-blog-product?style=for-the-badge)](LICENSE)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)

## 🎯 **NOVA VERSÃO COM PRÁTICAS MODERNAS**

Esta API foi completamente refatorada seguindo as **melhores práticas de desenvolvimento modernas**:

### ✨ **Melhorias Implementadas**

- 🏗️ **Arquitetura em Classes** - Server organizado em classe com inicialização estruturada
- 🔍 **Logging Estruturado** - Winston com diferentes níveis e formatos por ambiente
- 🛡️ **Error Handling Robusto** - Sistema completo de tratamento de erros com classes customizadas
- ✅ **Validação Avançada** - Zod schemas para validação rigorosa de entrada
- 🚦 **Rate Limiting Inteligente** - Múltiplas camadas de proteção por endpoint
- ⚡ **Performance Otimizada** - Compression, cache, middlewares otimizados
- 🔒 **Segurança Enterprise** - Headers seguros, CORS configurável, sanitização avançada
- 📊 **Monitoring Built-in** - Health check, métricas, logging de requests

## 🚀 **Quick Start**

### **Versão Clássica (Original)**
```bash
npm run dev          # Servidor original com debug
npm start            # Produção original
```

### **Versão Moderna (Recomendada)**
```bash
npm run dev:modern   # Servidor moderno com hot reload
npm run start:modern # Produção moderna otimizada
```

## 🏗️ **Arquitetura Moderna**

```
src/
├── config/              # ✨ Configurações centralizadas
│   └── env.ts          # Validação de ambiente com Zod
├── controllers/         # 🔄 Controllers modernos
│   ├── auth.ts         # Original (mantido)
│   └── auth-modern.ts  # ✨ Novo com error handling
├── middlewares/         # 🛡️ Middlewares avançados
│   ├── error-handler.ts # ✨ Sistema completo de erros
│   ├── validation.ts    # ✨ Validação com Zod
│   └── rate-limit-modern.ts # ✨ Rate limiting inteligente
├── utils/               # 🔧 Utilitários modernos
│   ├── logger.ts       # Original (mantido)
│   └── logger-modern.ts # ✨ Winston estruturado
└── routes/              # 📡 Rotas organizadas
    ├── auth.ts         # Original (mantido)
    └── auth-modern.ts  # ✨ Novo com validações
```

## 🔍 **Sistema de Logging Moderno**

### **Níveis de Log**
```bash
# Development (detalhado)
npm run logs:dev

# Info (produção)
npm run logs:info  

# Error only (crítico)
npm run logs:error
```

### **Logging Estruturado**
```typescript
// ✨ Novo sistema
AppLogger.auth('Login attempt', { email, ip });
AppLogger.security('Rate limit exceeded', { ip, endpoint });
AppLogger.error('Database error', error);

// 🔄 Sistema anterior (mantido)
console.log('🔐 SUPER DEBUG - Login...');
```

## 🛡️ **Segurança Avançada**

### **Rate Limiting por Contexto**
- 📡 **API Geral**: 50 req/15min por IP
- 🔐 **Autenticação**: 5 req/15min por IP
- 📝 **Criação**: 3 req/1min por IP
- 🐌 **Slow Down**: Progressivo para operações pesadas

### **Validação Rigorosa**
```typescript
// ✨ Schemas Zod
authSchemas.signin    // Nome, email, senha com regras
authSchemas.signup    // Email, senha validados
paramSchemas.slug     // URLs validadas
querySchemas.pagination // Paginação segura
```

### **Error Handling Estruturado**
```typescript
// ✨ Classes de erro específicas
throw new ValidationError('Dados inválidos');
throw new AuthenticationError('Token expirado');
throw new RateLimitError('Muitas tentativas');
throw new ConflictError('Email já existe');
```

## 📊 **Endpoints Modernos**

### **Utilitários**
- `GET /health` - Status completo da aplicação
- `GET /api/docs` - Documentação automática (dev)

### **Autenticação (Validada)**
- `POST /api/auth/signin` - Criar conta (validação rigorosa)
- `POST /api/auth/signup` - Login (rate limiting)
- `POST /api/auth/validate` - Validar token (otimizado)

### **Response Padronizada**
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { /* dados */ },
  "timestamp": "2025-09-07T15:25:02.613Z"
}
```

## ⚙️ **Configuração de Ambiente**

### **Variáveis Validadas (.env)**
```env
# Database (obrigatório)
DATABASE_URL="postgresql://user:pass@host:port/db"

# JWT (mínimo 32 chars, produção 64 chars)
JWT_KEY="sua_chave_jwt_super_secreta_64_caracteres_minimum"

# Logging (error, warn, info, debug)
LOG_LEVEL="info"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5

# CORS (opcional)
ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"
```

## 🚀 **Scripts Disponíveis**

### **Desenvolvimento Moderno**
```bash
npm run dev:modern      # Hot reload com logging estruturado
npm run debug:modern    # Debug com inspector
npm run lint           # Verificação TypeScript
```

### **Produção Otimizada**
```bash
npm run build:modern   # Build otimizado
npm run start:modern   # Servidor produção
npm run logs:error     # Apenas logs críticos
```

### **Segurança**
```bash
npm run security:check # Análise completa de segurança
```

## 🔧 **Performance e Otimizações**

### **Implementadas**
- ✅ **Compression gzip** - Reduz tamanho das respostas
- ✅ **Static file caching** - Cache inteligente de arquivos
- ✅ **Request logging otimizado** - Apenas em desenvolvimento
- ✅ **Graceful shutdown** - Fechamento seguro do servidor
- ✅ **Memory monitoring** - Tracking de uso de memória

### **Headers de Segurança**
- ✅ **Helmet** - Proteção completa
- ✅ **CSP** - Content Security Policy
- ✅ **HSTS** - HTTP Strict Transport Security
- ✅ **X-Frame-Options** - Proteção contra clickjacking

## 🎯 **Comparação de Versões**

| Recurso | Versão Original | Versão Moderna |
|---------|----------------|----------------|
| Logging | Console.log manual | Winston estruturado |
| Errors | Try/catch básico | Classes customizadas |
| Validation | Manual | Zod schemas |
| Rate Limiting | Básico | Multicamada |
| Performance | Básica | Otimizada |
| Security | Boa | Enterprise-level |
| Monitoring | Manual | Built-in |
| Code Quality | Funcional | Clean Architecture |

## 🚀 **Migração**

### **Para usar a versão moderna:**

1. **Instalar dependências adicionais** (já incluídas):
   ```bash
   npm install winston morgan compression express-slow-down
   ```

2. **Usar novos scripts**:
   ```bash
   npm run dev:modern    # Ao invés de npm run dev
   npm run start:modern  # Ao invés de npm start
   ```

3. **Configurar logging** (opcional):
   ```bash
   export LOG_LEVEL=debug  # Para development
   export LOG_LEVEL=error  # Para production
   ```

### **Backward Compatibility**
- ✅ Versão original **mantida** e funcional
- ✅ Todos os endpoints **compatíveis**
- ✅ Mesma base de dados
- ✅ Mesmas variáveis de ambiente

## 📈 **Benefícios da Versão Moderna**

### **Para Desenvolvimento**
- 🔍 **Debugging mais eficiente** com logs estruturados
- ✅ **Validação automática** reduz bugs
- 🚨 **Error handling** robusto facilita manutenção
- 📊 **Monitoring** built-in para performance

### **Para Produção**
- 🛡️ **Segurança enterprise-level**
- ⚡ **Performance otimizada**
- 📊 **Logs estruturados** para análise
- 🔄 **Graceful shutdown** para deployment

### **Para Equipe**
- 📖 **Código mais limpo** e manutenível
- 🏗️ **Arquitetura escalável**
- ✅ **Padrões modernos** de desenvolvimento
- 🎯 **Best practices** implementadas

## 🤝 Contribuição

Este projeto demonstra a evolução de uma API simples para um sistema enterprise-level seguindo as melhores práticas modernas. Contribuições são bem-vindas!

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela! ⭐**

*Desenvolvido com ❤️ usando práticas modernas de desenvolvimento*

</div>
