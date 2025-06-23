# API Documentation - BDD Service

Base URL: `http://localhost:3000/api`

## Authentification
Tous les endpoints retournent des réponses au format JSON avec la structure suivante :
```json
{
  "success": true,
  "data": {...} // ou "message" pour les suppressions
}
```

En cas d'erreur :
```json
{
  "success": false,
  "error": "Description de l'erreur"
}
```

## Endpoints

### Test de connexion
- **GET** `/test` - Vérifier la connexion Supabase

### Utilisateurs

#### Récupérer tous les utilisateurs
- **GET** `/users`
- **Réponse :** Liste de tous les utilisateurs

#### Récupérer un utilisateur par ID
- **GET** `/users/:id`
- **Paramètres :** `id` (number)
- **Réponse :** Détails de l'utilisateur

#### Créer un utilisateur
- **POST** `/users`
- **Body :**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Modifier un utilisateur
- **PUT** `/users/:id`
- **Paramètres :** `id` (number)
- **Body :** (tous les champs optionnels)
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Supprimer un utilisateur
- **DELETE** `/users/:id`
- **Paramètres :** `id` (number)

#### Rechercher des utilisateurs
- **GET** `/users/search?field=value`
- **Paramètres de requête :** Champs à filtrer

### Profils

#### Récupérer tous les profils
- **GET** `/profiles`
- **Réponse :** Liste de tous les profils

#### Récupérer un profil par ID
- **GET** `/profiles/:id`
- **Paramètres :** `id` (number)
- **Réponse :** Détails du profil

#### Récupérer le profil d'un utilisateur
- **GET** `/profiles/user/:userId`
- **Paramètres :** `userId` (number)
- **Réponse :** Profil de l'utilisateur

#### Récupérer un utilisateur avec son profil complet
- **GET** `/profiles/user/:userId/complete`
- **Paramètres :** `userId` (number)
- **Réponse :** Utilisateur avec son profil

#### Créer un profil
- **POST** `/profiles`
- **Body :**
```json
{
  "user_id": "number (requis)",
  "first_name": "string",
  "last_name": "string",
  "bio": "string",
  "avatar_url": "string"
}
```

#### Modifier un profil
- **PUT** `/profiles/:id`
- **Paramètres :** `id` (number)
- **Body :** (tous les champs optionnels)
```json
{
  "first_name": "string",
  "last_name": "string",
  "bio": "string",
  "avatar_url": "string"
}
```

#### Supprimer un profil
- **DELETE** `/profiles/:id`
- **Paramètres :** `id` (number)

#### Rechercher des profils
- **GET** `/profiles/search?field=value`
- **Paramètres de requête :** Champs à filtrer

### Localisations

#### Récupérer toutes les localisations
- **GET** `/localisations`
- **Réponse :** Liste de toutes les localisations

#### Récupérer une localisation par ID
- **GET** `/localisations/:id`
- **Paramètres :** `id` (number)
- **Réponse :** Détails de la localisation

#### Récupérer une localisation avec ses salles
- **GET** `/localisations/:id/salles`
- **Paramètres :** `id` (number)
- **Réponse :** Localisation avec les salles associées

#### Créer une localisation
- **POST** `/localisations`
- **Body :**
```json
{
  "latitude": "number (requis, -90 à 90)",
  "longitude": "number (requis, -180 à 180)"
}
```

#### Modifier une localisation
- **PUT** `/localisations/:id`
- **Paramètres :** `id` (number)
- **Body :** (tous les champs optionnels)
```json
{
  "latitude": "number",
  "longitude": "number"
}
```

#### Supprimer une localisation
- **DELETE** `/localisations/:id`
- **Paramètres :** `id` (number)

#### Rechercher des localisations
- **GET** `/localisations/search?field=value`
- **Paramètres de requête :** Champs à filtrer

#### Rechercher des localisations proches
- **GET** `/localisations/nearby?lat=latitude&lng=longitude&radius=km`
- **Paramètres de requête :** 
  - `lat` (number) - Latitude
  - `lng` (number) - Longitude
  - `radius` (number, optionnel) - Rayon en km (défaut: 10)

### Sessions

#### Récupérer toutes les sessions
- **GET** `/sessions`
- **Réponse :** Liste de toutes les sessions

#### Récupérer les sessions actives
- **GET** `/sessions/active`
- **Réponse :** Sessions non expirées

#### Récupérer une session par ID
- **GET** `/sessions/:id`
- **Paramètres :** `id` (number)
- **Réponse :** Détails de la session

#### Récupérer les sessions d'un utilisateur
- **GET** `/sessions/user/:userId`
- **Paramètres :** `userId` (number)
- **Réponse :** Sessions de l'utilisateur

#### Créer une session
- **POST** `/sessions`
- **Body :**
```json
{
  "user_id": "number (requis)",
  "expires_at": "string (requis, format ISO)",
  "device_type": "string",
  "browser": "string",
  "os": "string",
  "ip_address": "string",
  "location": "string",
  "is_mobile": "boolean"
}
```

#### Valider une session
- **POST** `/sessions/validate`
- **Body :**
```json
{
  "token": "string (requis)"
}
```

#### Modifier une session
- **PUT** `/sessions/:id`
- **Paramètres :** `id` (number)
- **Body :** (tous les champs optionnels)
```json
{
  "expires_at": "string",
  "device_type": "string",
  "browser": "string",
  "os": "string",
  "ip_address": "string",
  "location": "string",
  "is_mobile": "boolean"
}
```

#### Supprimer une session
- **DELETE** `/sessions/:id`
- **Paramètres :** `id` (number)

#### Supprimer toutes les sessions d'un utilisateur
- **DELETE** `/sessions/user/:userId`
- **Paramètres :** `userId` (number)

#### Rechercher des sessions
- **GET** `/sessions/search?field=value`
- **Paramètres de requête :** Champs à filtrer

### Salles

#### Récupérer toutes les salles
- **GET** `/salles`
- **Réponse :** Liste de toutes les salles

#### Récupérer une salle par ID
- **GET** `/salles/:id`
- **Paramètres :** `id` (number)
- **Réponse :** Détails de la salle

#### Récupérer une salle avec ses voies
- **GET** `/salles/:id/voies`
- **Paramètres :** `id` (number)
- **Réponse :** Salle avec toutes ses voies

#### Créer une salle
- **POST** `/salles`
- **Body :**
```json
{
  "nom": "string (requis)",
  "description": "string",
  "email": "string",
  "telephone": "string",
  "admin_id": "number",
  "localisation": "number"
}
```

#### Modifier une salle
- **PUT** `/salles/:id`
- **Paramètres :** `id` (number)
- **Body :** (tous les champs optionnels)
```json
{
  "nom": "string",
  "description": "string",
  "email": "string",
  "telephone": "string",
  "admin_id": "number",
  "localisation": "number"
}
```

#### Supprimer une salle
- **DELETE** `/salles/:id`
- **Paramètres :** `id` (number)

#### Rechercher des salles
- **GET** `/salles/search?field=value`
- **Paramètres de requête :** Champs à filtrer

### Voies

#### Récupérer toutes les voies
- **GET** `/voies`
- **Réponse :** Liste de toutes les voies

#### Récupérer une voie par ID
- **GET** `/voies/:id`
- **Paramètres :** `id` (number)
- **Réponse :** Détails de la voie

#### Récupérer les voies d'une salle
- **GET** `/voies/salle/:salleId`
- **Paramètres :** `salleId` (number)
- **Réponse :** Liste des voies de la salle

#### Créer une voie
- **POST** `/voies`
- **Body :**
```json
{
  "salle_id": "number (requis)",
  "cotation": "string",
  "description": "string",
  "ouvreur": "string",
  "type_de_voie": "string"
}
```

#### Modifier une voie
- **PUT** `/voies/:id`
- **Paramètres :** `id` (number)
- **Body :** (tous les champs optionnels)
```json
{
  "cotation": "string",
  "description": "string",
  "ouvreur": "string",
  "type_de_voie": "string"
}
```

#### Supprimer une voie
- **DELETE** `/voies/:id`
- **Paramètres :** `id` (number)

#### Rechercher des voies
- **GET** `/voies/search?field=value`
- **Paramètres de requête :** Champs à filtrer

### Séances

#### Récupérer toutes les séances
- **GET** `/seances`
- **Réponse :** Liste de toutes les séances

#### Récupérer une séance par ID
- **GET** `/seances/:id`
- **Paramètres :** `id` (number)
- **Réponse :** Détails de la séance

#### Récupérer les séances d'un utilisateur
- **GET** `/seances/user/:userId`
- **Paramètres :** `userId` (number)
- **Réponse :** Séances de l'utilisateur

#### Récupérer une séance avec ses voies
- **GET** `/seances/:id/complete`
- **Paramètres :** `id` (number)
- **Réponse :** Séance avec toutes ses voies

#### Créer une séance
- **POST** `/seances`
- **Body :**
```json
{
  "user_id": "number (requis)",
  "date": "string (requis, format ISO)",
  "avis": "string"
}
```

#### Modifier une séance
- **PUT** `/seances/:id`
- **Paramètres :** `id` (number)
- **Body :** (tous les champs optionnels)
```json
{
  "date": "string",
  "avis": "string"
}
```

#### Supprimer une séance
- **DELETE** `/seances/:id`
- **Paramètres :** `id` (number)

#### Rechercher des séances
- **GET** `/seances/search?field=value`
- **Paramètres de requête :** Champs à filtrer

#### Rechercher des séances par plage de dates
- **GET** `/seances/date-range?start=date&end=date`
- **Paramètres de requête :** 
  - `start` (string) - Date de début (format ISO)
  - `end` (string) - Date de fin (format ISO)

### Liaisons Voie-Séance

#### Récupérer toutes les liaisons voie-séance
- **GET** `/voie-seances`
- **Réponse :** Liste de toutes les liaisons

#### Récupérer une liaison par ID
- **GET** `/voie-seances/:id`
- **Paramètres :** `id` (number)
- **Réponse :** Détails de la liaison

#### Récupérer les voies d'une séance
- **GET** `/voie-seances/seance/:seanceId`
- **Paramètres :** `seanceId` (number)
- **Réponse :** Voies de la séance

#### Récupérer les voies d'une séance avec détails
- **GET** `/voie-seances/seance/:seanceId/complete`
- **Paramètres :** `seanceId` (number)
- **Réponse :** Voies de la séance avec détails complets

#### Récupérer les séances d'une voie
- **GET** `/voie-seances/voie/:voieId`
- **Paramètres :** `voieId` (number)
- **Réponse :** Séances de la voie

#### Créer une liaison voie-séance
- **POST** `/voie-seances`
- **Body :**
```json
{
  "seance_id": "number (requis)",
  "voie_id": "number (requis)",
  "reussie": "boolean",
  "avis": "string"
}
```

#### Créer plusieurs liaisons voie-séance
- **POST** `/voie-seances/batch`
- **Body :**
```json
{
  "voieSeances": [
    {
      "seance_id": "number",
      "voie_id": "number",
      "reussie": "boolean",
      "avis": "string"
    }
  ]
}
```

#### Modifier une liaison voie-séance
- **PUT** `/voie-seances/:id`
- **Paramètres :** `id` (number)
- **Body :** (tous les champs optionnels)
```json
{
  "reussie": "boolean",
  "avis": "string"
}
```

#### Supprimer une liaison voie-séance
- **DELETE** `/voie-seances/:id`
- **Paramètres :** `id` (number)

#### Supprimer toutes les voies d'une séance
- **DELETE** `/voie-seances/seance/:seanceId`
- **Paramètres :** `seanceId` (number)

#### Rechercher des liaisons voie-séance
- **GET** `/voie-seances/search?field=value`
- **Paramètres de requête :** Champs à filtrer

#### Obtenir les statistiques d'un utilisateur
- **GET** `/voie-seances/stats/user/:userId`
- **Paramètres :** `userId` (number)
- **Réponse :** Statistiques des voies de l'utilisateur

## Codes de statut HTTP

- **200** - Succès
- **201** - Créé avec succès
- **400** - Requête invalide
- **401** - Non autorisé (session expirée)
- **404** - Ressource non trouvée
- **500** - Erreur serveur

## Exemples d'utilisation

### Créer une salle avec localisation
```bash
# 1. Créer la localisation
curl -X POST http://localhost:3000/api/localisations \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 48.8566,
    "longitude": 2.3522
  }'

# 2. Créer la salle
curl -X POST http://localhost:3000/api/salles \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Salle de test",
    "description": "Une salle d'escalade",
    "email": "contact@salle.com",
    "telephone": "0123456789",
    "localisation": 1
  }'
```

### Créer une séance avec voies
```bash
# 1. Créer la séance
curl -X POST http://localhost:3000/api/seances \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "date": "2024-01-15T10:00:00Z",
    "avis": "Bonne séance"
  }'

# 2. Ajouter des voies à la séance
curl -X POST http://localhost:3000/api/voie-seances/batch \
  -H "Content-Type: application/json" \
  -d '{
    "voieSeances": [
      {
        "seance_id": 1,
        "voie_id": 1,
        "reussie": true,
        "avis": "Voie réussie"
      },
      {
        "seance_id": 1,
        "voie_id": 2,
        "reussie": false,
        "avis": "À retenter"
      }
    ]
  }'
```

### Rechercher des salles par nom
```bash
curl "http://localhost:3000/api/salles/search?nom=Salle"
```

### Obtenir les statistiques d'un utilisateur
```bash
curl "http://localhost:3000/api/voie-seances/stats/user/1"
``` 