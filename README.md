📂 Backend (inova-backend)

🔧 Tecnologias

NestJS + TypeScript

TypeORM (MySQL)

AWS S3 (upload de arquivos via Multer S3)

JWT Authentication (Passport + Guards)

Google OAuth

Padrões: Clean Architecture, DDD, SOLID

⚙️ Pré-requisitos

Node.js (v14+)

Yarn

MySQL

🚀 Instalação & Execução

cd backend/inova-backend
yarn install
yarn start

Configuração de Banco

O arquivo orm.config.json deve conter suas credenciais:

{
  "type": "mysql",
  "host": "<host>",
  "port": 3306,
  "username": "<user>",
  "password": "<pass>",
  "database": "inova_aprovanexus",
  "entities": ["dist/**/*.entity.js"],
  "synchronize": true
}

Variáveis de ambiente

JWT_SECRET: segredo para assinatura de tokens

GOOGLE_CLIENT_ID: client ID para login Google OAuth

AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_REGION, S3_BUCKET: configurações AWS S3

Scripts disponíveis

yarn start — inicia API em modo dev (ts-node)

yarn build — compila TS para dist/

yarn start:prod — executa build em produção

yarn migration:generate <nome> — gera migration (requer data-source.ts)

yarn migration:run — aplica migrations

🗂️ Estrutura de Pastas

inova-frontend/
├─ public/
├─ src/
│  ├─ pages/
│  ├─ components/
│  ├─ auth/
│  └─ api/
└─ vite.config.ts

inova-backend/
├─ src/
│  ├─ auth/
│  ├─ users/
│  ├─ ideias/
│  └─ main.ts
├─ orm.config.json
└─ tsconfig.json

📖 Documentação

Para detalhes de endpoints e fluxos de autenticação, consulte os comentários no código ou a Wiki interna deste repositório.
