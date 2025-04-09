# Service de Base de Données avec API Express

Ce service combine une base de données PostgreSQL et une API Express pour gérer les interactions avec la base de données.

## Prérequis

- Docker
- Docker Compose
- Node.js (v14 ou supérieur)
- npm

## Structure du Projet

```
BDD-Service/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   └── index.js
│   └── index.js
├── .env
├── docker-compose.yml
├── package.json
└── README.md
```

## Configuration

1. Modifiez le fichier `.env` avec vos paramètres :
   - POSTGRES_USER : nom d'utilisateur
   - POSTGRES_PASSWORD : mot de passe
   - POSTGRES_DB : nom de la base de données
   - PORT : port de l'API (défaut: 3000)
   - NODE_ENV : environnement (development/production)

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Démarrer la base de données :

```bash
docker-compose up -d
```

3. Démarrer l'API :

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## API Endpoints

- GET `/health` : Vérification de l'état du service
- GET `/api/test` : Test de la connexion à la base de données
- POST `/api/data` : Exemple d'insertion de données

## Base de Données

- Host: localhost
- Port: 5432
- Base de données: valeur de POSTGRES_DB
- Utilisateur: valeur de POSTGRES_USER
- Mot de passe: valeur de POSTGRES_PASSWORD

## Volumes

Les données sont persistantes grâce au volume Docker `postgres_data`.

## Sécurité

- Les identifiants sont stockés dans le fichier `.env`
- Le port 5432 est exposé uniquement sur localhost
- Utilisez des mots de passe forts en production
- L'API utilise helmet pour la sécurité
- CORS est configuré pour la sécurité des requêtes cross-origin
