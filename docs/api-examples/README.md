# Exemples d'API - REST Client

Ce dossier contient des fichiers d'exemples pour tester les endpoints de l'API avec l'extension REST Client de VS Code/Cursor.

## 📁 Fichiers disponibles

- `user.api.example.http` - Tests complets pour le UserController

## 🚀 Comment utiliser

### Prérequis
1. Installer l'extension **REST Client** dans VS Code/Cursor
2. Démarrer le serveur BDD sur le port 3003
3. Ouvrir un fichier `.http` dans ce dossier

### Utilisation
1. Ouvrir le fichier d'exemple souhaité
2. Cliquer sur **"Send Request"** au-dessus de chaque requête
3. Les résultats s'afficheront dans un nouvel onglet

### Variables d'environnement
Chaque fichier contient des variables en haut :
- `@baseUrl` - URL de base du serveur (par défaut: http://localhost:3003)
- `@userId` - ID utilisateur pour les tests (par défaut: 1)

## 📋 Types de tests inclus

### Cas normaux
- Requêtes GET, POST, PUT, DELETE standard
- Recherche avec paramètres

### Cas d'erreur
- IDs invalides (string, négatif, décimal)
- IDs inexistants
- Données manquantes
- Formats invalides (email, password)
- Body vide
- Paramètres de recherche invalides

## 🔧 Personnalisation

Pour adapter les tests à ton environnement :
1. Modifier `@baseUrl` si ton serveur tourne sur un autre port
2. Changer `@userId` pour tester avec différents utilisateurs
3. Ajouter de nouveaux cas de test selon tes besoins

## 📝 Ajouter de nouveaux exemples

Pour créer des exemples pour d'autres controllers :
1. Copier le fichier `user.api.example.http`
2. Renommer selon le controller (ex: `session.api.example.http`)
3. Adapter les endpoints et les données de test
4. Ajouter le fichier à cette liste 