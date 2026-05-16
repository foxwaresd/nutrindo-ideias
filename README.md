# Nutrindo Ideias

Microblog sofisticado construído com Next.js 16, Firebase e Tailwind CSS 4.

## Stack

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript
- **Estilo**: Tailwind CSS 4 + @tailwindcss/typography
- **Banco de dados**: Firebase Firestore
- **Autenticação**: Firebase Auth (Google Sign-In)
- **Storage**: Firebase Storage (imagens de capa e inline)
- **Editor**: TipTap (rich text com cores, negrito, itálico, listas, imagens...)
- **Deploy**: Vercel (recomendado)

## Funcionalidades

- Feed de posts com destaques e lista de mais recentes
- Tópicos e tags filtráveis na sidebar
- Página individual por post com URL própria (SEO-friendly)
- Metadata e Open Graph automáticos por post
- Sitemap.xml gerado automaticamente
- Área administrativa protegida por Google Sign-In
- Editor rico: negrito, itálico, sublinhado, títulos, listas, cores, marcação, links, imagens
- Upload de imagem de capa por post
- Publicar / salvar como rascunho
- Layout responsivo (mobile-first)

## Configuração

### 1. Firebase

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com)
2. Ative **Firestore Database** (modo de produção)
3. Ative **Authentication** → Google Sign-In
4. Ative **Storage**
5. Copie as credenciais do Web App

### 2. Variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha `.env.local` com as credenciais do Firebase.

### 3. Regras Firestore e Storage

No console Firebase, aplique as regras de `firestore.rules` e `storage.rules`.

### 4. Adicionar admin

No Firestore, crie a coleção `admins` com um documento cujo **ID = seu UID do Firebase Auth**.

Para encontrar seu UID:
1. Faça login na área `/admin/login`
2. Acesse Firebase Console → Authentication → Users
3. Copie seu UID
4. No Firestore: `admins/{seu-uid}` → `{ "email": "seuemail@gmail.com" }`

### 5. Rodar localmente

```bash
npm run dev
```

Acesse `http://localhost:3000` e `/admin` para a área administrativa.

## Deploy na Vercel

1. Push para GitHub
2. Conecte o repo na [Vercel](https://vercel.com)
3. Adicione as variáveis de ambiente no painel
4. Deploy automático a cada push
