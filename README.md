# Elos - Backend

Este é um repositório de backend utilizando o framework [NestJS](https://nestjs.com/) com TypeScript. O projeto está integrado ao Prisma ORM e utiliza MySQL como banco de dados. Em caso de dúvidas sobre o mesmo, visite a [Documentação do NestJS](https://docs.nestjs.com)

---

## 🚀 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18+)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/) (5.7 ou superior)

---

## ⚙️ Configuração do Ambiente

1. **Clone o repositório**

```bash
git clone https://github.com/JeanLimaa/elos-backend.git
cd elos-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env`:

- Em Unix/macOS:
```bash
cp .env.example .env
```
- Em Windows (PowerShell):
```bash
Copy-Item .env.example .env
```
- Depois de criar o .env, edite os valores conforme necessário. (Em especial o usuario e senha do DATABASE_URL)

---

4. **Rode as migrações do Prisma**

```bash
npx prisma migrate dev
```

---

## Compilar e rodar projeto

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```