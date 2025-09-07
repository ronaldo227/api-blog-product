#!/bin/bash

# 🚀 SCRIPT PARA CONFIGURAR GITHUB
# Execute após criar o repositório no GitHub

echo "🚀 === CONFIGURAÇÃO GITHUB ==="
echo ""

# Solicitar informações do usuário
echo "📝 Digite seu nome de usuário do GitHub:"
read -r github_user

echo "📝 Digite o nome do repositório (ex: api-blog-product):"
read -r repo_name

# Validar inputs
if [ -z "$github_user" ] || [ -z "$repo_name" ]; then
    echo "❌ Erro: Nome de usuário e repositório são obrigatórios!"
    exit 1
fi

# Configurar remote
echo "🔗 Configurando repositório remoto..."
git remote add origin "https://github.com/$github_user/$repo_name.git"

# Verificar se deu certo
if git remote get-url origin &> /dev/null; then
    echo "✅ Remote configurado: $(git remote get-url origin)"
else
    echo "❌ Erro ao configurar remote"
    exit 1
fi

# Renomear branch para main
echo "🌟 Renomeando branch para main..."
git branch -M main

# Fazer push inicial
echo "🚀 Enviando código para GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 === SUCESSO! ==="
    echo "✅ Projeto enviado para: https://github.com/$github_user/$repo_name"
    echo "✅ Branch principal: main"
    echo "✅ Remote configurado como origin"
    echo ""
    echo "🔄 A partir de agora você pode usar:"
    echo "   ./sync.sh        # Para sync automático"
    echo "   git push         # Para envio manual"
    echo "   git pull         # Para puxar mudanças"
else
    echo ""
    echo "❌ === ERRO NO PUSH ==="
    echo "Possíveis causas:"
    echo "1. 🔐 Repositório não existe no GitHub"
    echo "2. 🔑 Problemas de autenticação"
    echo "3. 🌐 Problemas de conexão"
    echo ""
    echo "💡 Soluções:"
    echo "1. Verifique se criou o repositório no GitHub"
    echo "2. Configure suas credenciais Git:"
    echo "   git config --global user.name 'Seu Nome'"
    echo "   git config --global user.email 'seu@email.com'"
    echo "3. Use token de acesso pessoal se necessário"
fi
