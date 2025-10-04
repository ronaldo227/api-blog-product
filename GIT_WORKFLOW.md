# 🌿 **GIT WORKFLOW & BRANCHES - GUIA COMPLETO**

## 📋 **ESTRUTURA DE BRANCHES RECOMENDADA**

### 🏠 **BRANCHES PRINCIPAIS**
```bash
main            # Produção - sempre estável
develop         # Desenvolvimento - integração de features
```

### 🚀 **BRANCHES DE TRABALHO**
```bash
feature/        # Novas funcionalidades
hotfix/         # Correções urgentes em produção
release/        # Preparação para nova versão
bugfix/         # Correções de bugs
```

---

## 🔧 **COMANDOS ESSENCIAIS**

### **1. CONFIGURAÇÃO INICIAL**
```bash
# Configurar usuário (uma vez só)
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Configurar branch padrão como main
git config --global init.defaultBranch main
```

### **2. CRIANDO BRANCHES**
```bash
# Criar branch de desenvolvimento
git checkout -b develop

# Criar feature branch
git checkout -b feature/nova-funcionalidade

# Criar hotfix
git checkout -b hotfix/correcao-critica

# Criar release
git checkout -b release/v1.1.0
```

### **3. TRABALHANDO COM BRANCHES**
```bash
# Listar todas as branches
git branch -a

# Mudar de branch
git checkout develop
git checkout main

# Deletar branch local
git branch -d feature/funcionalidade-concluida

# Deletar branch remota
git push origin --delete feature/funcionalidade-antiga
```

---

## 🔄 **WORKFLOW RECOMENDADO**

### **PARA NOVAS FEATURES:**
```bash
# 1. Partir do develop
git checkout develop
git pull origin develop

# 2. Criar feature branch
git checkout -b feature/auth-melhorada

# 3. Trabalhar e fazer commits
git add .
git commit -m "feat: implementa autenticação OAuth"

# 4. Push da feature
git push origin feature/auth-melhorada

# 5. Merge para develop (via PR no GitHub)
git checkout develop
git merge feature/auth-melhorada
git push origin develop

# 6. Limpar branch
git branch -d feature/auth-melhorada
```

### **PARA HOTFIXES:**
```bash
# 1. Partir direto do main
git checkout main
git pull origin main

# 2. Criar hotfix
git checkout -b hotfix/security-patch

# 3. Fazer correção
git add .
git commit -m "fix: corrige vulnerabilidade de segurança"

# 4. Merge direto no main
git checkout main
git merge hotfix/security-patch
git push origin main

# 5. Também merge no develop
git checkout develop
git merge hotfix/security-patch
git push origin develop
```

---

## 📦 **MENSAGENS DE COMMIT PADRÃO**

### **TIPOS DE COMMIT:**
```bash
feat:     # Nova funcionalidade
fix:      # Correção de bug
docs:     # Documentação
style:    # Formatação (sem mudança de código)
refactor: # Refatoração
test:     # Testes
chore:    # Manutenção/configuração
```

### **EXEMPLOS:**
```bash
git commit -m "feat: adiciona endpoint de upload de imagens"
git commit -m "fix: corrige bug no login com JWT"
git commit -m "docs: atualiza README com instruções de deploy"
git commit -m "refactor: otimiza queries do Prisma"
git commit -m "chore: atualiza dependências de segurança"
```

---

## 🎯 **CONFIGURAÇÃO RECOMENDADA PARA SEU PROJETO**

### **CRIAR ESTRUTURA COMPLETA:**
```bash
# 1. Criar develop a partir do main
git checkout -b develop
git push origin develop

# 2. Proteger branches principais (no GitHub)
# Settings → Branches → Add rule
# - main: Require pull requests, Require status checks
# - develop: Require pull requests

# 3. Configurar branch padrão para PRs como develop
```

### **EXEMPLO DE WORKFLOW PARA PRÓXIMAS FEATURES:**
```bash
# Nova feature de blog posts
git checkout develop
git checkout -b feature/blog-posts
# ... desenvolvimento ...
git push origin feature/blog-posts
# Abrir PR: feature/blog-posts → develop

# Nova feature de comentários
git checkout develop
git checkout -b feature/comentarios
# ... desenvolvimento ...
git push origin feature/comentarios
# Abrir PR: feature/comentarios → develop

# Release para produção
git checkout develop
git checkout -b release/v1.1.0
# ... testes finais ...
git checkout main
git merge release/v1.1.0
git tag v1.1.0
git push origin main --tags
```

---

## 🚨 **BOAS PRÁTICAS**

### ✅ **FAÇA:**
- Sempre pull antes de criar nova branch
- Use nomes descritivos para branches
- Faça commits pequenos e frequentes
- Escreva mensagens de commit claras
- Use Pull Requests para code review
- Mantenha main sempre estável
- Delete branches após merge

### ❌ **EVITE:**
- Commit direto no main
- Branches com nomes genéricos (test, fix)
- Commits gigantes
- Mensagens vagas ("fix", "update")
- Trabalhar muito tempo sem push
- Deixar branches antigas no repositório

---

## 🎯 **COMANDOS PARA SEU PROJETO ATUAL**

### **CONFIGURAR AGORA:**
```bash
# Criar develop branch
git checkout -b develop
git push origin develop

# Configurar upstream
git branch --set-upstream-to=origin/develop develop

# Verificar configuração
git branch -vv
```

### **PRÓXIMOS PASSOS:**
1. 🌿 Criar branch `develop`
2. 🔒 Proteger `main` no GitHub
3. 🚀 Usar workflow com feature branches
4. 📝 Padronizar mensagens de commit
5. 🔄 Usar Pull Requests para code review

---

**Agora você tem um workflow profissional completo! 🚀**