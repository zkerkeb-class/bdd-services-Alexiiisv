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

| Colonne    | Type         | Description              |
| ---------- | ------------ | ------------------------ |
| id         | SERIAL       | Clé primaire             |
| user_id    | INTEGER      | Référence vers users(id) |
| token      | VARCHAR(255) | Token unique             |
| expires_at | TIMESTAMP    | Date d'expiration        |
| created_at | TIMESTAMP    | Date de création         |

## Relations

- Un profil (profiles) appartient à un utilisateur (users)
- Une session (sessions) appartient à un utilisateur (users)
- Suppression en cascade : si un utilisateur est supprimé, ses profils et sessions sont également supprimés
