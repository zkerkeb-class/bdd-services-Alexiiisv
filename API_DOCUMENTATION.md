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

#### Connexion utilisateur
- **POST** `/users/login`
- **Body :**
```json
{
  "email": "string",
  "password": "string"
}
```
- **Réponse :**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "number",
      "username": "string",
      "email": "string",
      "created_at": "string",
      "updated_at": "string"
    },
    "token": "string"
  }
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
  - `