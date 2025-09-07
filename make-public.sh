#!/bin/bash

# 🌐 SCRIPT PARA TORNAR REPOSITÓRIO PÚBLICO

echo "🌐 === TORNANDO REPOSITÓRIO PÚBLICO ==="
echo ""

echo "🔗 Abrindo página de configurações do GitHub..."

# Abrir no navegador padrão
if command -v xdg-open > /dev/null; then
    xdg-open "https://github.com/ronaldo227/api-blog-product/settings"
elif command -v open > /dev/null; then
    open "https://github.com/ronaldo227/api-blog-product/settings"
else
    echo "📋 Acesse manualmente: https://github.com/ronaldo227/api-blog-product/settings"
fi

echo ""
echo "📋 PASSOS PARA TORNAR PÚBLICO:"
echo ""
echo "1. 📜 Role até o FINAL da página"
echo "2. 🔍 Encontre a seção 'Danger Zone' (vermelha)"
echo "3. 🔄 Clique em 'Change repository visibility'"
echo "4. 🌍 Selecione 'Public'"
echo "5. 📝 Digite: api-blog-product"
echo "6. ✅ Clique em 'I understand, change repository visibility'"
echo ""
echo "🎯 VERIFICAÇÃO:"
echo "Acesse: https://github.com/ronaldo227/api-blog-product"
echo "Se não mostrar 'Private', está público! ✅"
echo ""
echo "🏆 BENEFÍCIOS APÓS PÚBLICO:"
echo "✅ Visível como portfólio"
echo "✅ Pode receber stars ⭐"
echo "✅ Aparece em buscas"
echo "✅ Outros podem contribuir"
