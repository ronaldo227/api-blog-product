# USAGE.md

Guia prático de uso da API, exemplos de requisições e dicas para desenvolvedores e integradores.

## Índice
- [Introdução](#introdução)
- [Requisitos](#requisitos)
- [Exemplos de Uso](#exemplos-de-uso)
- [Autenticação](#autenticação)
- [Erros Comuns](#erros-comuns)

## Introdução
Este documento mostra como consumir a API de forma eficiente e segura.

## Requisitos
- Node.js >= 18
- Variáveis de ambiente configuradas
- Banco de dados PostgreSQL

## Exemplos de Uso
### Login
```http
POST /api/auth/login
Content-Type: application/json
{
  "email": "user@dominio.com",
  "password": "senha"
}
```

### Criar Post
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json
{
  "title": "Título",
  "content": "Conteúdo"
}
```

## Autenticação
Utilize JWT no header Authorization para rotas protegidas.

## Erros Comuns
- 401 Unauthorized: Token inválido ou ausente
- 400 Bad Request: Dados inválidos
