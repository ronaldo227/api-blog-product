#!/bin/bash

# 🔄 SCRIPT DE SYNC AUTOMÁTICO
# Facilita o processo de commit e push

echo "🔄 === GIT SYNC AUTOMÁTICO ==="
echo ""

# Verificar se há mudanças
if git diff --quiet && git diff --staged --quiet; then
    echo "✅ Nenhuma alteração para sincronizar"
    echo "📊 Status do repositório:"
    git status --porcelain
    exit 0
fi

# Mostrar statusP
echo "📊 Alterações detectadas:"
git status --short
echo ""

# Adicionar todos os arquivos
echo "📦 Adicionando arquivos..."
git add .

# Solicitar mensagem de commit
echo "💬 Digite a mensagem do commit (ou pressione Enter para usar mensagem automática):"
read -r commit_message

# Usar mensagem padrão se vazio
if [ -z "$commit_message" ]; then
    commit_message="🔄 Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Fazer commit
echo "💾 Fazendo commit..."
git commit -m "$commit_message"

# Verificar se há remote configurado
if git remote get-url origin &> /dev/null; then
    # Push para o repositório remoto
    echo "🚀 Enviando para repositório remoto..."
    git push
    
    if [ $? -eq 0 ]; then
        echo "✅ Sync completo! Alterações enviadas com sucesso."
    else
        echo "❌ Erro ao enviar. Verifique sua conexão e autenticação."
    fi
else
    echo "⚠️ Nenhum repositório remoto configurado."
    echo "📝 Para configurar GitHub:"
    echo "   git remote add origin https://github.com/SEU_USUARIO/api-blog-product.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
fi

echo ""
echo "🎯 Sync finalizado!"
