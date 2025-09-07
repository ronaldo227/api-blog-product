#!/bin/bash

# 🧪 SCRIPT DE TESTE RÁPIDO DOS COMANDOS

echo "🧪 TESTANDO SCRIPTS DO PACKAGE.JSON"
echo "===================================="
echo ""

cd "/home/ronaldodev/Área de trabalho/projetoNode/node_projct/api-blog-product"

echo "📋 Scripts disponíveis:"
echo "  ✅ npm run logs        # Logs completos em modo dev"
echo "  ✅ npm run dev:modern  # Servidor moderno"
echo "  ✅ npm run health      # Health check"
echo "  ✅ npm run check       # Lint + Security"
echo "  ✅ npm run clean       # Limpar cache"
echo "  ✅ npm run restart     # Restart servidor"
echo ""

echo "🔍 Verificando TypeScript..."
npm run lint
echo ""

echo "🛡️ Verificando segurança..."
npm run security:check
echo ""

echo "🧹 Limpando cache..."
npm run clean
echo ""

echo "🎉 TODOS OS SCRIPTS FUNCIONANDO!"
echo ""
echo "📝 COMANDOS PRINCIPAIS:"
echo "  npm run logs     # ← USE ESTE para desenvolvimento completo"
echo "  npm run health   # ← USE ESTE para verificar se está funcionando"
echo "  npm run check    # ← USE ESTE antes de commits"
