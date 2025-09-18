This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Chat SaaS – Portfolio Project

## English

Chat SaaS is a modern, full-stack web application designed as a showcase for my portfolio. Built with Next.js, TypeScript, and a modular component architecture, it demonstrates advanced skills in frontend and backend development, UI/UX design, and scalable SaaS application patterns.

### Features

- **Multi-Page Chat Experience:** Organize conversations, knowledge, and discussions in a clean, intuitive interface.
- **Authentication Flows:** Includes sign-in and sign-up pages for user management.
- **Conversation Persistance:** Backup system developped with a MongoDB Cluster.
- **Reusable UI Components:** Custom-built UI elements (buttons, cards, forms, tooltips, etc.) for a consistent and modern look using Shadcn.
- **AI Elements:** Components for chatbot interactions, code blocks, reasoning chains, and more using AI SDK's AI Elements
- **API-Ready Structure:** Modular API routes for easy backend integration and extension.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **Docker Support:** Includes a Dockerfile for easy deployment.

### Technologies

- Next.js (App Router)
- TypeScript
- React
- MongoDB
- PostCSS
- Docker
- pnpm
- Shadcn
- AI SDK
- Shadcn
- Clerk

### Project Structure

- `src/app/` – Application pages and API routes
- `src/components/` – UI and AI components
- `src/lib/` – Utility functions
- `public/` – Static assets

### Setup

You must have a MongoDB connection string, an OpenAI API key and a Perplexity API Key.
Fill the blanks in the .env.exemple file and then remove the .exemple at the end.

### How to Run

1. Install dependencies:
   ```sh
   pnpm install
   ```
2. Start the development server:
   ```sh
   pnpm dev
   ```
3. Visit [http://localhost:3000](http://localhost:3000)

---

## Français

Chat SaaS est une application web moderne, full-stack, conçue comme projet de portfolio. Développée avec Next.js, TypeScript et une architecture de composants modulaire, elle met en avant mes compétences avancées en développement frontend et backend, design UI/UX, et conception d’applications SaaS évolutives.

### Fonctionnalités

- **Expérience de chat multi-pages :** Organisation des conversations, connaissances et discussions dans une interface claire et intuitive.
- **Authentification :** Pages d’inscription et de connexion pour la gestion des utilisateurs.
- **Composants UI réutilisables :** Éléments d’interface personnalisés (boutons, cartes, formulaires, info-bulles, etc.) pour un rendu moderne et cohérent.
- **Persistance des Conversations:** Enregistrement des conversation sur MongoDB avec génération de titre.
- **Éléments IA :** Composants pour interactions chatbot, blocs de code, chaînes de raisonnement, et plus.
- **Structure API-ready :** Routes API modulaires pour une intégration et une extension backend faciles.
- **Design responsive :** Optimisé pour ordinateurs et mobiles.
- **Support Docker :** Dockerfile inclus pour un déploiement simplifié.

### Technologies

- Next.js (App Router)
- TypeScript
- React
- MongoDB
- PostCSS
- Docker
- pnpm
- Shadcn
- AI SDK
- Shadcn
- Clerk

### Structure du projet

- `src/app/` – Pages de l’application et routes API
- `src/components/` – Composants UI et IA
- `src/lib/` – Fonctions utilitaires
- `public/` – Fichiers statiques

### Setup

Vous devez avoir une chaine de connexion MongoDB, une cké d'api OpenAI et ue clé d'api Perplexity.
Remplissez les champs vides dans le fichier .env.exemple, puis retirer le .exemple du nom.

### Démarrage

1. Installer les dépendances :
   ```sh
   pnpm install
   ```
2. Lancer le serveur de développement :
   ```sh
   pnpm dev
   ```
3. Accéder à [http://localhost:3000](http://localhost:3000)

Pour construire et lancer avec Docker :

```sh
docker build -t chat-saas .
docker run -p 3000:3000 chat-saas
```

---

**This project is part of my personal portfolio.**

**Ce projet fait partie de mon portfolio personnel.**
