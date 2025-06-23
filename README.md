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
│   ├── routes/
│   ├── scripts/
│   └── index.ts
├── docs/
│   └── database-structure.md
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

## Documentation

- Structure de la base de données : [docs/database-structure.md](docs/database-structure.md)
- API Endpoints : `/health`, `/api/test`, `/api/data`

## Scripts

- `npm run dev` : Mode développement
- `npm run build` : Compilation TypeScript
- `npm start` : Mode production
- `npm run seed` : Fake data
- `npm test` : Tests
