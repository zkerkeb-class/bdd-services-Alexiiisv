# Service de Base de Données avec API Express (TypeScript)

Service d'API REST avec base de données PostgreSQL, développé en TypeScript.

## Prérequis

- Docker
- Docker Compose
- Node.js (v14+)
- npm

## Structure du Projet

```
BDD-Service/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── scripts/
│   └── index.ts
├── docs/
│   ├── api-examples/
│   └── database-structure.md
├── sql/
├── dist/
├── .env
├── .env.local
├── docker-compose.yml
├── nodemon.json
└── package.json
```

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Configurer l'environnement :

```bash
cp .env.local .env
# Modifier les variables dans .env
```

## Démarrage

```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

## Fonctionnalités

### Gestion des Conversations de Chat
Le service inclut maintenant un système complet de gestion des conversations avec le bot IA d'escalade :

- **Historique des conversations** par utilisateur
- **Sessions de conversation** avec UUID unique
- **Recherche** dans les conversations
- **Statistiques** d'utilisation
- **Pagination** pour les grandes listes

#### Routes principales :
- `GET /chat-conversations` - Liste toutes les conversations
- `GET /chat-conversations/user/:userId` - Conversations d'un utilisateur
- `GET /chat-conversations/session/:conversationUid` - Session de conversation
- `POST /chat-conversations` - Créer une nouvelle conversation
- `GET /chat-conversations/search` - Rechercher dans les conversations
- `GET /chat-conversations/stats/user/:userId` - Statistiques utilisateur

### Autres fonctionnalités
- Gestion des utilisateurs et profils
- Gestion des salles d'escalade et voies
- Gestion des séances et performances
- Système de localisation
- Gestion des sessions utilisateur

## Documentation

- Structure de la base de données : [docs/database-structure.md](docs/database-structure.md)
- Exemples d'API : [docs/api-examples/](docs/api-examples/)
  - [Conversations de chat](docs/api-examples/chat-conversations.api.example.http)
  - [Utilisateurs](docs/api-examples/user.api.example.http)
- API Endpoints : `/health`, `/api/test`, `/api/data`

## Scripts

- `npm run dev` : Mode développement
- `npm run build` : Compilation TypeScript
- `npm start` : Mode production
- `npm run seed` : Fake data
- `npm test` : Tests
