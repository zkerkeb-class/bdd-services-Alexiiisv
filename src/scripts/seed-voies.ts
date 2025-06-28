import dotenv from "dotenv";
import { faker } from "@faker-js/faker/locale/fr";
import { supabase } from "../config/supabase";

dotenv.config();

// Fonction pour nettoyer la table voies
const cleanVoies = async (): Promise<void> => {
  await supabase.from("voie").delete().neq("id", 0);
  await supabase.from("voies").delete().neq("id", 0);
  console.log("✅ Table voies nettoyée avec succès");
};

// Fonction pour générer une voie d'escalade aléatoire
const generateVoie = (salleId: number) => {
  const cotations = [
    "3a", "3b", "3c", "4a", "4b", "4c", "5a", "5b", "5c",
    "6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+",
    "8a", "8a+", "8b", "8b+", "8c", "8c+", "9a", "9a+", "9b", "9b+", "9c", "9c+"
  ];

  const typesDeVoie = [
    "Bloc",
    "Voie",
    "Dévers",
    "Dalle",
    "Surplomb",
    "Dièdre",
    "Fissure",
    "Réglette",
    "Pince",
    "Goutte d'eau"
  ];

  const ouvreurs = [
    "Jean Dupont",
    "Marie Martin",
    "Pierre Durand",
    "Sophie Bernard",
    "Lucas Petit",
    "Emma Roux",
    "Thomas Moreau",
    "Julie Simon",
    "Nicolas Michel",
    "Camille Leroy"
  ];

  const descriptions = [
    "Voie technique avec des prises minuscules",
    "Bloc puissant sur des volumes",
    "Dévers athlétique avec des crochets",
    "Dalle friction sur du granit",
    "Surplomb avec des prises généreuses",
    "Dièdre technique en fissure",
    "Réglettes sur du calcaire",
    "Pinces et pinces sur du grès",
    "Goutte d'eau sur des prises humides",
    "Voie mixte avec du dévers et de la dalle"
  ];

  return {
    salle_id: salleId,
    cotation: faker.helpers.arrayElement(cotations),
    description: faker.helpers.arrayElement(descriptions),
    ouvreur: faker.helpers.arrayElement(ouvreurs),
    type_de_voie: faker.helpers.arrayElement(typesDeVoie)
  };
};

// Fonction pour insérer les voies
const insertVoies = async (): Promise<void> => {
  try {
    // Nettoyer la table avant d'insérer
    await cleanVoies();

    console.log("🌱 Début de l'insertion des voies...");

    // Récupérer les IDs des salles existantes
    const { data: salles, error: sallesError } = await supabase
      .from("salles")
      .select("id, nom");

    if (sallesError || !salles) {
      throw sallesError || new Error("Impossible de récupérer les salles");
    }

    const salleIds = salles.map(salle => salle.id);

    // Générer 15-25 voies par salle
    const voies = [];
    for (const salleId of salleIds) {
      const nombreVoies = faker.number.int({ min: 15, max: 25 });
      
      for (let i = 0; i < nombreVoies; i++) {
        const voie = generateVoie(salleId);
        voies.push(voie);
      }
    }

    // Insérer toutes les voies
    const { error: voiesError } = await supabase
      .from("voies")
      .insert(voies);

    if (voiesError) {
      throw voiesError;
    }

    console.log(`✅ ${voies.length} voies ont été créées avec succès`);
    console.log(`✅ Répartition par salle:`);
    
    for (const salle of salles) {
      const voiesDansSalle = voies.filter(voie => voie.salle_id === salle.id).length;
      console.log(`   - ${salle.nom}: ${voiesDansSalle} voies`);
    }

  } catch (err) {
    console.error("❌ Erreur lors de l'insertion des voies:", err);
  }
};

// Exécuter le script
insertVoies(); 