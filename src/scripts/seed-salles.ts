import dotenv from "dotenv";
import { faker } from "@faker-js/faker/locale/fr";
import { supabase } from "../config/supabase";

dotenv.config();

// Fonction pour nettoyer les tables
const cleanTables = async (): Promise<void> => {
  await supabase.from("voie").delete().neq("id", 0);
  await supabase.from("voies").delete().neq("id", 0);
  await supabase.from("salles").delete().neq("id", 0);
  await supabase.from("localisation").delete().neq("id", 0);
  console.log("✅ Tables nettoyées avec succès");
};

// Fonction pour générer une localisation aléatoire en France
const generateLocation = () => {
  // Coordonnées approximatives de la France
  const latitude = faker.location.latitude({ min: 41.0, max: 51.0 });
  const longitude = faker.location.longitude({ min: -5.0, max: 10.0 });

  return {
    latitude,
    longitude
  };
};

// Fonction pour générer une salle d'escalade aléatoire
const generateSalle = (adminId: number, localisationId: number) => {
  const salleNames = [
    "Bloc & Co",
    "Vertical Art",
    "Climb Up",
    "Arkose",
    "Block'Out",
    "Murmur",
    "Altitude",
    "Vertical",
    "Grimper",
    "Escalade Plus"
  ];

  const salleName = faker.helpers.arrayElement(salleNames);
  const city = faker.location.city();

  return {
    admin_id: adminId,
    localisation: localisationId,
    description: faker.lorem.paragraph(),
    email: faker.internet.email({ firstName: salleName, lastName: city }),
    telephone: faker.phone.number('0# ## ## ## ##'),
    nom: `${salleName} ${city}`
  };
};

// Fonction pour insérer les salles
const insertSalles = async (): Promise<void> => {
  try {
    // Nettoyer les tables avant d'insérer
    await cleanTables();

    console.log("🌱 Début de l'insertion des salles...");

    // Récupérer les IDs des utilisateurs existants
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id")
      .limit(10);

    if (usersError || !users) {
      throw usersError || new Error("Impossible de récupérer les utilisateurs");
    }

    const userIds = users.map(user => user.id);

    // Générer 8 salles
    const salles = [];
    for (let i = 0; i < 8; i++) {
      // Créer une localisation
      const location = generateLocation();
      const { data: locationData, error: locationError } = await supabase
        .from("localisation")
        .insert([location])
        .select("id")
        .single();

      if (locationError || !locationData) {
        throw locationError || new Error("Erreur lors de la création de la localisation");
      }

      // Créer une salle
      const salle = generateSalle(
        faker.helpers.arrayElement(userIds),
        locationData.id
      );

      const { data: salleData, error: salleError } = await supabase
        .from("salles")
        .insert([salle])
        .select("id, nom")
        .single();

      if (salleError || !salleData) {
        throw salleError || new Error("Erreur lors de la création de la salle");
      }

      salles.push(salleData);
      console.log(`✅ Salle "${salleData.nom}" créée avec succès`);
    }

    console.log(`✅ ${salles.length} salles ont été créées avec succès`);

  } catch (err) {
    console.error("❌ Erreur lors de l'insertion des salles:", err);
  }
};

// Exécuter le script
insertSalles(); 