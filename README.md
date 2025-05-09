Inova Aprovanexus

Este repositório contém duas pastas principais:

frontend (inova-frontend): aplicação cliente em React + TypeScript

backend (inova-backend): API REST em NestJS + TypeORM

📂 Frontend (inova-frontend)

🔧 Tecnologias

React 18 + TypeScript

Vite

Tailwind CSS (Design System reutilizável)

Axios (requisições HTTP)

React Router (navegação)

Testing Library + Jest (testes unitários e de integração)

Padrões: Clean Architecture, DDD, SOLID

⚙️ Pré-requisitos

Node.js (v14+)

Yarn

🚀 Instalação & Execução

cd frontend/inova-frontend
yarn install

Variáveis de ambiente

Crie um arquivo .env na raiz de inova-frontend com:

VITE_API_URL=http://localhost:3004

Scripts disponíveis

yarn dev — executa o servidor de desenvolvimento (Vite)

yarn build — gera build de produção

yarn preview — pré-visualiza o build localmente

yarn test — executa a suíte de testes (Jest)
