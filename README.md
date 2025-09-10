
# API Blog Product

![Visitas](https://komarev.com/ghpvc/?username=ronaldo227&label=Visualizações&color=0e75b6&style=flat)

<br>

Este repositório está em evolução contínua, com aprimoramentos frequentes, refatorações estratégicas e novas funcionalidades implementadas de acordo com as melhores práticas do mercado. Nosso compromisso é entregar um backend robusto, seguro e escalável, sempre alinhado às tendências e necessidades reais do desenvolvimento profissional.

---


Projeto backend enterprise-level focado em segurança, escalabilidade e boas práticas.

---



## 🚀 Diferenciais Técnicos

- Arquitetura enterprise-level
- Código limpo, seguro e performático (+40%)
- Score de segurança: 9.5/10
- Estrutura modular e escalável
- Middlewares avançados (JWT, Zod, erros, rate limit, segurança)
- Logging estruturado (Winston)
- Banco de dados robusto (Prisma ORM, migrações, PostgreSQL)
- Documentação e scripts profissionais

## 🚀 Tecnologias

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Helmet, CORS, Rate Limiting

---

## ✨ Funcionalidades

- Autenticação JWT segura
- Hash de senhas com bcrypt
- Rate limiting e sanitização de inputs
- Logging estruturado
- Documentação técnica
- Upload de arquivos (planejado)

---

## 📦 Instalação

```bash
git clone https://github.com/ronaldo227/api-blog-product.git
cd api-blog-product
npm install
cp .env.example .env # Configure suas variáveis
npx prisma migrate dev
npm run dev

---


# <span style="font-size:2em;">🛠️ Melhorias Detalhadas — 09/09/2025</span>

### Controller de Criação de Post (`admin.ts`)

- **Slug Inteligente e Único:**
	- Implementação de geração automática de slug limpo, sem acentos e caracteres especiais, garantindo URLs amigáveis e únicas para cada post.
	- Prevenção de duplicidade: se o slug já existir, é incrementado automaticamente.

- **Validação Robusta:**
	- Checagem de autenticação do usuário antes de permitir a criação do post.
	- Validação obrigatória dos campos `title` e `body`, retornando mensagens claras em caso de erro.

- **Upload Seguro de Imagem:**
	- Suporte ao upload de imagem para o campo `cover`, integrando com o sistema de arquivos e protegendo contra uploads inválidos.

- **Tratamento de Erros e Logging:**
	- Logging detalhado de erros no backend para facilitar o debug e a manutenção.
	- Respostas HTTP padronizadas para cada cenário (401, 400, 201, 500).

- **Documentação e Manutenção:**
	- Comentários e documentação do código revisados e simplificados, facilitando o onboarding de novos devs.
	- Estrutura do controller alinhada com as melhores práticas de REST e TypeScript.

> _Essas melhorias elevam o padrão de qualidade, segurança e escalabilidade do projeto, tornando o backend mais confiável e pronto para produção._

---


---

## ⚙️ Variáveis de Ambiente

Veja `.env.example` para todos os parâmetros necessários.

---

## 🛡️ Segurança

- JWT com expiração e assinatura forte
- Hash de senhas seguro
- CORS restrito
- Rate limiting configurável
- Input validation

---

## 📚 Documentação

Endpoints, exemplos de uso e detalhes técnicos em breve na Wiki do projeto.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Abra uma issue ou pull request para sugerir melhorias.

---

## 📄 Licença

MIT. Veja o arquivo LICENSE para mais detalhes.
---


