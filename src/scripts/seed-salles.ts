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

// Liste de villes françaises avec coordonnées
const frenchCities = [
  { name: "Paris", latitude: 48.8566, longitude: 2.3522 },
  { name: "Lyon", latitude: 45.7640, longitude: 4.8357 },
  { name: "Marseille", latitude: 43.2965, longitude: 5.3698 },
  { name: "Toulouse", latitude: 43.6047, longitude: 1.4442 },
  { name: "Nice", latitude: 43.7102, longitude: 7.2620 },
  { name: "Nantes", latitude: 47.2184, longitude: -1.5536 },
  { name: "Strasbourg", latitude: 48.5734, longitude: 7.7521 },
  { name: "Montpellier", latitude: 43.6119, longitude: 3.8777 },
  { name: "Bordeaux", latitude: 44.8378, longitude: -0.5792 },
  { name: "Lille", latitude: 50.6292, longitude: 3.0573 }
];

// Fonction pour générer une salle d'escalade aléatoire
const generateSalle = (adminId: number, localisationId: number, city: string) => {
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
      // Choisir une ville aléatoire
      const cityObj = faker.helpers.arrayElement(frenchCities);
      const city = cityObj.name;
      const location = {
        latitude: cityObj.latitude,
        longitude: cityObj.longitude
      };
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
        locationData.id,
        city
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