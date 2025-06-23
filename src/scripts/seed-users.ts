import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker/locale/fr";
import { supabase } from "../config/supabase";

dotenv.config();

// Fonction pour nettoyer la base de données
const cleanDatabase = async (): Promise<void> => {
  // Supprimer dans l'ordre pour respecter les contraintes de clés étrangères
  await supabase.from("sessions").delete().neq("id", 0);
  await supabase.from("profiles").delete().neq("id", 0);
  await supabase.from("users").delete().neq("id", 0);
  console.log("✅ Base de données nettoyée avec succès");
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
    password: "Test12345!",
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
  try {
    // Hasher le mot de passe
    const passwordHash = await hashPassword(userData.password);

    // Insérer l'utilisateur
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert([
        {
          username: userData.username,
          email: userData.email,
          password_hash: passwordHash,
        },
      ])
      .select("id")
      .single();

    if (userError || !user) {
      throw userError || new Error("User insertion failed");
    }

    // Insérer le profil
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          user_id: user.id,
          first_name: userData.profile.first_name,
          last_name: userData.profile.last_name,
          bio: userData.profile.bio,
          avatar_url: userData.profile.avatar_url,
        },
      ]);

    if (profileError) {
      throw profileError;
    }

    console.log(`✅ Utilisateur ${userData.username} créé avec succès`);
  } catch (err) {
    console.error(
      `❌ Erreur lors de la création de l'utilisateur ${userData.username}:`,
      err
    );
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
  }
};

// Exécuter le script
seedUsers();
