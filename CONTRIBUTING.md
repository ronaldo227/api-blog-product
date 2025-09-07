# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o **API Blog Product**! 

## 📋 Código de Conduta

Este projeto adere a um código de conduta. Ao participar, você concorda em manter um ambiente respeitoso e inclusivo.

## 🚀 Como Contribuir

### **🐛 Reportando Bugs**

Antes de reportar um bug:
1. ✅ Verifique se já não foi reportado nas [Issues](https://github.com/ronaldo227/api-blog-product/issues)
2. ✅ Teste com a versão mais recente
3. ✅ Execute `./security-test.sh` para verificar se não é um problema de configuração

**Template para Bug Report:**
```markdown
## 🐛 Descrição do Bug
Descrição clara e concisa do bug.

## 🔄 Passos para Reproduzir
1. Execute comando X
2. Acesse endpoint Y
3. Veja o erro

## ✅ Comportamento Esperado
O que deveria acontecer.

## 💻 Ambiente
- OS: [ex: Ubuntu 22.04]
- Node.js: [ex: 18.17.0]
- npm: [ex: 9.8.1]

## 📊 Logs
Cole aqui os logs relevantes (sem informações sensíveis).
```

### **💡 Sugerindo Melhorias**

**Template para Feature Request:**
```markdown
## 🎯 Funcionalidade Sugerida
Descrição clara da funcionalidade.

## 🤔 Problema que Resolve
Explique o problema que esta funcionalidade resolveria.

## 💭 Solução Proposta
Descreva como você imagina que funcionaria.

## 🔄 Alternativas Consideradas
Outras abordagens que você considerou.
```

### **🔧 Contribuindo com Código**

#### **Configuração do Ambiente:**
```bash
# 1. Fork do repositório
git clone https://github.com/SEU_USUARIO/api-blog-product.git
cd api-blog-product

# 2. Instalar dependências
npm install

# 3. Configurar ambiente
cp .env.example .env
# Editar .env com suas configurações

# 4. Configurar banco
npx prisma migrate dev

# 5. Testar
npm run dev
```

#### **Workflow de Desenvolvimento:**
```bash
# 1. Criar branch para feature
git checkout -b feature/nome-da-feature

# 2. Fazer mudanças
# ... desenvolver ...

# 3. Testar segurança
./security-test.sh

# 4. Commit
git add .
git commit -m "feat: adiciona nova funcionalidade X"

# 5. Push
git push origin feature/nome-da-feature

# 6. Abrir Pull Request
```

## 📏 Padrões de Código

### **🎨 Style Guide**
- ✅ Use **TypeScript** para tipagem
- ✅ Siga o **ESLint** configurado
- ✅ Use **Prettier** para formatação
- ✅ Implemente **debug logging** com emojis
- ✅ Documente funções complexas

### **📝 Convenção de Commits**
Use [Conventional Commits](https://conventionalcommits.org/):

```bash
feat: adiciona nova funcionalidade
fix: corrige bug específico
docs: atualiza documentação
style: mudanças de formatação
refactor: refatoração sem mudança de funcionalidade
test: adiciona ou corrige testes
security: melhorias de segurança
```

### **🔐 Segurança**
- ❌ **Nunca** commite chaves secretas
- ✅ **Sempre** use `bcrypt` para senhas
- ✅ **Valide** todas as entradas
- ✅ **Implemente** rate limiting
- ✅ **Teste** com `./security-test.sh`

### **🔍 Debug Logging**
Siga o padrão existente:
```typescript
console.log('🎯 SUPER DEBUG FEATURE - Action:', {
    timestamp: new Date().toISOString(),
    data: relevantData,
    status: 'success'
});
```

**Emojis por Categoria:**
- 🌟 Server operations
- 🔐 Authentication  
- 🗄️ Database
- 🛡️ Security
- 📚 Controllers
- 🔗 Routes

## 🧪 Testes

### **Executar Testes:**
```bash
# Teste de segurança
./security-test.sh

# Compilação TypeScript
npm run build

# Servidor de desenvolvimento
npm run dev
```

### **Adicionar Novos Testes:**
- Adicione testes de segurança em `security-test.sh`
- Documente novos endpoints
- Teste edge cases

## 📋 Checklist para Pull Requests

Antes de submeter um PR, verifique:

### **🔧 Código**
- [ ] Código compila sem erros TypeScript
- [ ] Segue padrões de style guide
- [ ] Debug logging implementado
- [ ] Funções documentadas
- [ ] Sem hardcoded secrets

### **🔐 Segurança**
- [ ] `./security-test.sh` passa
- [ ] Entradas validadas com Zod
- [ ] Rate limiting implementado (se aplicável)
- [ ] Headers de segurança configurados
- [ ] Sem vulnerabilidades introduzidas

### **📚 Documentação**
- [ ] README.md atualizado (se necessário)
- [ ] Comentários no código
- [ ] Endpoints documentados
- [ ] CHANGELOG atualizado

### **🎯 Funcionalidade**
- [ ] Feature funciona como esperado
- [ ] Não quebra funcionalidades existentes
- [ ] Tratamento de erros implementado
- [ ] Performance adequada

## 💬 Comunicação

### **Onde Buscar Ajuda:**
- 📋 [Issues](https://github.com/ronaldo227/api-blog-product/issues) - Para bugs e features
- 📧 Email: devronaldosilva893@gmail.com - Para questões diretas

### **Tempo de Resposta:**
- 🐛 Bugs críticos: 24h
- 💡 Features e melhorias: 48-72h
- 📝 Documentação: 1 semana

## 🏆 Reconhecimento

Contribuidores serão reconhecidos:
- ✅ Nome no README.md
- ✅ Histórico no Git
- ✅ Agradecimento nas releases

## 📚 Recursos Úteis

- [Documentação TypeScript](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [OWASP Security Guide](https://owasp.org/www-project-top-ten/)

---

**Obrigado por contribuir! 🙏**

*Juntos, podemos tornar este projeto ainda melhor!* ✨
