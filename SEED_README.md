# Scripts de Seed pour BDD Service

Ce dossier contient les scripts pour peupler la base de données avec des données de test réalistes.

## 📋 Scripts disponibles

### Scripts individuels

- **`seed-users.ts`** - Crée 10 utilisateurs avec leurs profils
- **`seed-salles.ts`** - Crée 8 salles d'escalade avec leurs localisations
- **`seed-voies.ts`** - Crée 15-25 voies par salle (120-200 voies total)
- **`seed-seances.ts`** - Crée 2-5 séances par utilisateur avec liaisons voie-séance
- **`seed-chat-conversations.ts`** - Crée 3-8 conversations de chat par utilisateur
- **`seed-logs.ts`** - Crée 100 logs HTTP et 50 logs email

### Script principal

- **`seed-all.ts`** - Exécute tous les scripts dans le bon ordre de dépendances

## 🚀 Utilisation

### Prérequis

1. Assurez-vous que votre base de données Supabase est configurée
2. Vérifiez que votre fichier `.env` contient les bonnes variables d'environnement
3. Installez les dépendances : `npm install`

### Exécution

#### Exécuter tous les seeds (recommandé)
```bash
npm run seed:all
```

#### Exécuter un seed spécifique
```bash
# Utilisateurs uniquement
npm run seed:users

# Salles uniquement
npm run seed:salles

# Voies uniquement
npm run seed:voies

# Séances uniquement
npm run seed:seances

# Conversations de chat uniquement
npm run seed:chat

# Logs uniquement
npm run seed:logs
```

## 📊 Données générées

### Utilisateurs
- **10 utilisateurs** avec noms, emails et mots de passe français
- **Profils** avec bio, prénom, nom de famille
- **Mots de passe** : `Test12345!` (hashés avec bcrypt)

### Salles d'escalade
- **8 salles** réparties en France
- **Localisations** avec coordonnées GPS réalistes
- **Informations** : nom, description, email, téléphone

### Voies d'escalade
- **15-25 voies par salle** (120-200 voies total)
- **Cotations** de 3a à 9c+
- **Types** : Bloc, Voie, Dévers, Dalle, Surplomb, etc.
- **Ouvreurs** et descriptions réalistes

### Séances
- **2-5 séances par utilisateur**
- **3-8 voies par séance**
- **Statistiques** de réussite réalistes
- **Avis** et commentaires

### Conversations de chat
- **3-8 conversations par utilisateur**
- **10 types** de conversations différents
- **Messages** et réponses réalistes sur l'escalade

### Logs
- **100 logs HTTP** avec méthodes, URLs, codes de statut
- **50 logs email** avec types de notifications
- **Données** : temps de réponse, IP, User-Agent, etc.

## 🔄 Ordre d'exécution

Les scripts doivent être exécutés dans cet ordre pour respecter les contraintes de clés étrangères :

1. `seed-users.ts` - Crée les utilisateurs (base)
2. `seed-salles.ts` - Crée les salles (dépend des utilisateurs)
3. `seed-voies.ts` - Crée les voies (dépend des salles)
4. `seed-seances.ts` - Crée les séances (dépend des utilisateurs et voies)
5. `seed-chat-conversations.ts` - Crée les conversations (dépend des utilisateurs)
6. `seed-logs.ts` - Crée les logs (dépend des utilisateurs)

## ⚠️ Attention

- **Nettoyage automatique** : Chaque script nettoie ses tables avant d'insérer
- **Dépendances** : Assurez-vous que les tables parentes existent
- **Données de test** : Ces données sont uniquement pour le développement
- **Production** : Ne pas utiliser en production

## 🛠️ Personnalisation

Vous pouvez modifier les scripts pour :
- Changer le nombre d'éléments générés
- Ajouter de nouveaux types de données
- Modifier les valeurs par défaut
- Adapter les données à votre contexte

## 📝 Exemples de données générées

### Utilisateur
```json
{
  "username": "jean.dupont",
  "email": "jean.dupont@example.com",
  "profile": {
    "first_name": "Jean",
    "last_name": "Dupont",
    "bio": "Passionné d'escalade depuis 5 ans..."
  }
}
```

### Salle
```json
{
  "nom": "Bloc & Co Paris",
  "description": "Salle moderne avec 200 voies...",
  "email": "contact@blocandco-paris.fr",
  "telephone": "01 23 45 67 89"
}
```

### Voie
```json
{
  "cotation": "6b+",
  "type_de_voie": "Dévers",
  "description": "Dévers athlétique avec des crochets",
  "ouvreur": "Marie Martin"
}
```

## 🔧 Dépannage

### Erreur de connexion Supabase
- Vérifiez vos variables d'environnement
- Assurez-vous que votre projet Supabase est actif

### Erreur de contraintes de clés étrangères
- Exécutez les scripts dans l'ordre recommandé
- Vérifiez que les tables parentes existent

### Erreur de types TypeScript
- Vérifiez que `ts-node` est installé
- Assurez-vous que les types sont corrects 