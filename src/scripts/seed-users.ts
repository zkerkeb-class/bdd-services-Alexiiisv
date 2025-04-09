import dotenv from "dotenv";
import { pool } from "../config/database";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker/locale/fr";

dotenv.config();

// Fonction pour nettoyer la base de données
const cleanDatabase = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    console.log("🧹 Nettoyage de la base de données...");
    await client.query("BEGIN");

    // Supprimer les données dans l'ordre pour respecter les contraintes de clés étrangères
    await client.query("DELETE FROM sessions");
    await client.query("DELETE FROM profiles");
    await client.query("DELETE FROM users");

    await client.query("COMMIT");
    console.log("✅ Base de données nettoyée avec succès");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Erreur lors du nettoyage de la base de données:", err);
    throw err;
  } finally {
    client.release();
  }
};

// Fonction pour générer un hash de mot de passe
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Fonction pour générer un utilisateur aléatoire
const generateUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet
    .userName({ firstName, lastName })
    .toLowerCase();

  return {
    username,
    email: faker.internet.email({ firstName, lastName }),
    password: faker.internet.password({ length: 12 }),
    profile: {
      first_name: firstName,
      last_name: lastName,
      bio: faker.person.bio(),
      avatar_url: null,
    },
  };
};

// Générer 10 utilisateurs
const users = Array.from({ length: 10 }, generateUser);

// Fonction pour insérer un utilisateur et son profil
const insertUserWithProfile = async (userData: any): Promise<void> => {
  const client = await pool.connect();

  try {
    // Démarrer une transaction
    await client.query("BEGIN");

    // Hasher le mot de passe
    const passwordHash = await hashPassword(userData.password);

    // Insérer l'utilisateur
    const userResult = await client.query(
      `INSERT INTO users (username, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [userData.username, userData.email, passwordHash]
    );

    const userId = userResult.rows[0].id;

    // Insérer le profil
    await client.query(
      `INSERT INTO profiles (user_id, first_name, last_name, bio, avatar_url) 
       VALUES ($1, $2, $3, $4, $5)`,
      [
        userId,
        userData.profile.first_name,
        userData.profile.last_name,
        userData.profile.bio,
        userData.profile.avatar_url,
      ]
    );

    // Valider la transaction
    await client.query("COMMIT");

    console.log(`✅ Utilisateur ${userData.username} créé avec succès`);
  } catch (err) {
    // Annuler la transaction en cas d'erreur
    await client.query("ROLLBACK");
    console.error(
      `❌ Erreur lors de la création de l'utilisateur ${userData.username}:`,
      err
    );
  } finally {
    // Libérer le client
    client.release();
  }
};

// Fonction principale pour insérer tous les utilisateurs
const seedUsers = async (): Promise<void> => {
  try {
    // Nettoyer la base de données avant d'insérer les nouvelles données
    await cleanDatabase();

    console.log("🌱 Début de l'insertion des utilisateurs...");

    // Insérer chaque utilisateur
    for (const user of users) {
      await insertUserWithProfile(user);
    }

    console.log("✅ Tous les utilisateurs ont été créés avec succès");
  } catch (err) {
    console.error("❌ Erreur lors de l'insertion des utilisateurs:", err);
  } finally {
    // Fermer la connexion à la base de données
    await pool.end();
  }
};

// Exécuter le script
seedUsers();
