# 🔍 GUIA DE DEBUG - API BLOG PRODUCT MODERNA

## 🚀 **COMANDOS DE DEBUG DISPONÍVEIS**

### **1. Debug Básico (Desenvolvimento)**
```bash
npm run dev:modern
# Servidor com hot reload na porta 4444
```

### **2. Debug Avançado (Logs Completos)**
```bash
npm run logs:dev
# DEBUG=api:* + logs estruturados
```

### **3. Debug com Inspector (VSCode/Chrome)**
```bash
npm run debug:modern
# Inspector na porta 9229
# Chrome: chrome://inspect
# VSCode: Attach to Node Process
```

### **4. Debug Manual (Porta Customizada)**
```bash
PORT=4445 tsx server-modern.ts
# Porta customizada para testes
```

---

## 🔍 **ENDPOINTS DE DEBUG**

### **Health Check**
```bash
curl -X GET http://localhost:4444/health
```
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-07T15:30:58.610Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "1.0.0",
  "memory": {...},
  "nodeVersion": "v20.19.4"
}
```

### **API Documentation (Dev Only)**
```bash
curl -X GET http://localhost:4444/api/docs
```

### **Ping Test**
```bash
curl -X GET http://localhost:4444/api/ping
```

---

## 📊 **LOGS ESTRUTURADOS**

### **Levels Disponíveis:**
- `error`: Apenas erros críticos
- `warn`: Avisos + erros
- `info`: Informações + warn + error
- `debug`: Tudo (apenas desenvolvimento)

### **Configurar Log Level:**
```bash
LOG_LEVEL=debug npm run dev:modern
LOG_LEVEL=info npm run start:modern
LOG_LEVEL=error npm run start:modern
```

---

## 🛠️ **DEBUG DE AUTENTICAÇÃO**

### **Teste de Signin (Criar Conta)**
```bash
curl -X POST http://localhost:4444/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "Test123!"
  }'
```

### **Teste de Signup (Login)**
```bash
curl -X POST http://localhost:4444/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### **Teste de Validação de Token**
```bash
curl -X POST http://localhost:4444/api/auth/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🚨 **DEBUG DE ERROS**

### **Logs de Erro Estruturados:**
- **Request Info**: método, URL, IP, user agent
- **Error Details**: message, stack trace, code
- **Context**: usuário, timestamp, environment

### **Rate Limiting Debug:**
```bash
# Teste de rate limiting (5 requests rápidas)
for i in {1..6}; do 
  curl -X POST http://localhost:4444/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","password":"123456"}'
  echo "Request $i"
done
```

---

## 🔧 **CONFIGURAÇÕES DE DEBUG**

### **Variáveis de Ambiente (.env):**
```env
NODE_ENV=development          # Habilita debug features
LOG_LEVEL=debug              # Máximo nível de log
DEBUG=api:*                  # Debug namespace pattern
PORT=4444                    # Porta do servidor
```

### **TypeScript Debug:**
```bash
npm run lint                 # Verificar erros TS
npx tsc --noEmit            # Compilação sem output
```

### **Security Debug:**
```bash
npm run security:check      # Script de segurança
```

---

## 🎯 **DEBUGGING COMUM**

### **1. Servidor não inicia:**
- ✅ Verificar se `.env` existe
- ✅ Verificar `DATABASE_URL` e `JWT_KEY`
- ✅ Verificar se porta está livre
- ✅ Verificar dependências: `npm install`

### **2. Requests falham:**
- ✅ Verificar CORS (origins permitidas)
- ✅ Verificar rate limiting
- ✅ Verificar Content-Type headers
- ✅ Verificar logs estruturados

### **3. Auth não funciona:**
- ✅ Verificar JWT_KEY (mín 32 chars)
- ✅ Verificar formato do token
- ✅ Verificar expiração (1h)
- ✅ Verificar header Authorization

### **4. Database errors:**
- ✅ Verificar DATABASE_URL
- ✅ Verificar se Prisma está configurado
- ✅ Rodar: `npx prisma generate`
- ✅ Rodar: `npx prisma migrate dev`

---

## 🔍 **FERRAMENTAS DE DEBUG**

### **VSCode Extensions:**
- **REST Client**: Para testar endpoints
- **Thunder Client**: Cliente HTTP integrado
- **Prisma**: Syntax highlighting
- **Error Lens**: Erros inline

### **Chrome DevTools:**
- Acessar: `chrome://inspect`
- Clicar: "Open dedicated DevTools for Node"
- Usar breakpoints no código

### **Logs em Tempo Real:**
```bash
# Terminal 1: Servidor
npm run dev:modern

# Terminal 2: Logs filtrados
tail -f logs/combined.log | grep ERROR
```

---

## 📱 **TESTE COMPLETO**

```bash
# 1. Iniciar servidor
npm run dev:modern

# 2. Health check
curl http://localhost:4444/health

# 3. API docs
curl http://localhost:4444/api/docs

# 4. Teste auth completo
curl -X POST http://localhost:4444/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"name":"Debug User","email":"debug@test.com","password":"Debug123!"}'

# 5. Verificar logs
# Logs aparecem no terminal em tempo real
```

---

## 🎉 **SISTEMA DE DEBUG PRONTO!**

O servidor moderno agora tem:
- ✅ **Logging estruturado** com Winston
- ✅ **Error handling robusto** 
- ✅ **Validation detalhada** com Zod
- ✅ **Rate limiting granular**
- ✅ **Health monitoring**
- ✅ **Development tools** integradas

**Use os comandos acima para debugar qualquer problema!** 🔍
