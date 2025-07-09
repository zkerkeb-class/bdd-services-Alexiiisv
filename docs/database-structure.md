# Structure de la Base de Données

## Tables

### Users

| Colonne       | Type         | Description              |
| ------------- | ------------ | ------------------------ |
| id            | SERIAL       | Clé primaire             |
| username      | VARCHAR(50)  | Nom d'utilisateur unique |
| email         | VARCHAR(100) | Email unique             |
| password_hash | VARCHAR(255) | Hash du mot de passe     |
| created_at    | TIMESTAMP    | Date de création         |
| updated_at    | TIMESTAMP    | Date de mise à jour      |

### Profiles

| Colonne    | Type         | Description              |
| ---------- | ------------ | ------------------------ |
| id         | SERIAL       | Clé primaire             |
| user_id    | INTEGER      | Référence vers users(id) |
| first_name | VARCHAR(50)  | Prénom                   |
| last_name  | VARCHAR(50)  | Nom                      |
| bio        | TEXT         | Biographie               |
| avatar_url | VARCHAR(255) | URL de l'avatar          |
| created_at | TIMESTAMP    | Date de création         |
| updated_at | TIMESTAMP    | Date de mise à jour      |

### Sessions

| Colonne      | Type           | Description                        |
| ------------ | --------------| -----------------------------------|
| id           | SERIAL         | Clé primaire                       |
| user_id      | INTEGER        | Référence vers users(id)           |
| token        | VARCHAR(255)   | Token unique                       |
| expires_at   | TIMESTAMP      | Date d'expiration                  |
| created_at   | TIMESTAMP      | Date de création                   |
| device_type  | VARCHAR(50)    | Type d'appareil                    |
| browser      | VARCHAR(100)   | Navigateur                         |
| os           | VARCHAR(100)   | Système d'exploitation             |
| ip_address   | VARCHAR(100)   | Adresse IP                         |
| last_activity| TIMESTAMP      | Dernière activité                  |
| location     | VARCHAR(255)   | Localisation                       |
| is_mobile    | BOOLEAN        | Appareil mobile ou non             |

### Localisation

| Colonne   | Type              | Description         |
| --------- | ----------------- | -------------------|
| id        | SERIAL            | Clé primaire       |
| latitude  | DOUBLE PRECISION  | Latitude           |
| longitude | DOUBLE PRECISION  | Longitude          |

### Salles

| Colonne      | Type           | Description                              |
| ------------ | --------------| -----------------------------------------|
| id           | SERIAL         | Clé primaire                             |
| admin_id     | INTEGER        | Référence vers users(id)                 |
| localisation | INTEGER        | Référence vers localisation(id)          |
| description  | TEXT           | Description de la salle                  |
| email        | VARCHAR(100)   | Email de la salle                        |
| telephone    | VARCHAR(30)    | Téléphone de la salle                    |
| nom          | VARCHAR(100)   | Nom de la salle                          |
| created_at   | TIMESTAMP      | Date de création                         |
| updated_at   | TIMESTAMP      | Date de mise à jour                      |

### Voies

| Colonne        | Type           | Description                              |
| -------------- | -------------- | -----------------------------------------|
| id             | SERIAL         | Clé primaire                             |
| salle_id       | INTEGER        | Référence vers salles(id)                |
| cotation       | VARCHAR(20)    | Cotation de la voie                      |
| description    | TEXT           | Description de la voie                   |
| ouvreur        | VARCHAR(100)   | Ouvreur de la voie                       |
| type_de_voie   | VARCHAR(50)    | Type de voie                             |
| created_at     | TIMESTAMP      | Date de création                         |
| updated_at     | TIMESTAMP      | Date de mise à jour                      |

### Seances

| Colonne    | Type         | Description                        |
| ---------- | ------------| -----------------------------------|
| id         | SERIAL      | Clé primaire                       |
| user_id    | INTEGER     | Référence vers users(id)           |
| date       | TIMESTAMP   | Date de la séance                  |
| avis       | TEXT        | Avis sur la séance                 |

### Voie (liaison seances/voies)

| Colonne    | Type         | Description                        |
| ---------- | ------------| -----------------------------------|
| id         | SERIAL      | Clé primaire                       |
| seance_id  | INTEGER     | Référence vers seances(id)         |
| voie_id    | INTEGER     | Référence vers voies(id)           |
| reussie    | BOOLEAN     | Voie réussie ou non                |
| avis       | TEXT        | Avis sur la voie                   |

### http_logs

| Colonne         | Type                    | Description                                 |
| --------------- | ---------------------- | ------------------------------------------- |
| id              | BIGSERIAL               | Clé primaire                                |
| created_at      | TIMESTAMP WITH TIME ZONE| Date et heure de la requête                 |
| method          | VARCHAR(10)             | Méthode HTTP (GET, POST, etc.)              |
| url             | TEXT                    | URL appelée                                 |
| status_code     | INTEGER                 | Code de réponse HTTP                        |
| response_time_ms| FLOAT                   | Temps de réponse en millisecondes           |
| content_length  | INTEGER                 | Taille de la réponse (octets)               |
| user_id         | INTEGER                 | ID utilisateur (nullable)                   |
| ip_address      | VARCHAR(45)             | Adresse IP de l'utilisateur                 |
| user_agent      | TEXT                    | User-Agent du client                        |
| referrer        | TEXT                    | Referrer HTTP                               |
| error_message   | TEXT                    | Message d'erreur éventuel                   |

## Relations

- Un profil (profiles) appartient à un utilisateur (users)
- Une session (sessions) appartient à un utilisateur (users)
- Suppression en cascade : si un utilisateur est supprimé, ses profils et sessions sont également supprimés
- Une salle (salles) peut avoir une localisation (localisation)
- Une voie (voies) appartient à une salle (salles)
- Une séance (seances) appartient à un utilisateur (users)
- La table voie fait le lien entre seances et voies
