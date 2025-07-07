import dotenv from "dotenv";
import { faker } from "@faker-js/faker/locale/fr";
import { supabase } from "../config/supabase";

dotenv.config();

// Fonction pour nettoyer la table voies
const cleanVoies = async (): Promise<void> => {
  await supabase.from("voie").delete().neq("id", 0);
  await supabase.from("voies").delete().neq("id", 0);
  await supabase.rpc('reset_voies_id_seq');
  console.log("✅ Table voies nettoyée avec succès");
};

// Tableau des cotations et pondérations centrées sur 6a
const cotations = [
  "3a", "3b", "3c", "4a", "4b", "4c", "5a", "5b", "5c",
  "6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+",
  "8a", "8a+", "8b", "8b+", "8c", "8c+", "9a", "9a+", "9b", "9b+", "9c", "9c+"
];

// Poids décroissants à mesure qu'on s'éloigne de 6a
const cotationWeights = [
  1, 1, 1, 2, 2, 2, 4, 5, 7, // 3-5c
  15, 12, 10, 8, 6, 4,       // 6a-6c+
  4, 3, 2, 2, 1, 1,           // 7a-7c+
  1, 1, 1, 1, 1, 1,           // 8a-8c+
  1, 1, 1, 1                  // 9a-9c+
];

// Fonction de tirage pondéré
function weightedRandom(items: string[], weights: number[]): string {
  const total = weights.reduce((acc, w) => acc + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    if (r < weights[i]) return items[i];
    r -= weights[i];
  }
  return items[items.length - 1]; // fallback
}

// Tableau de 50 noms de voies prédéfinis
const nomsDeVoies = [
  "La Traversée", "Le Dièdre Bleu", "L'Éperon", "La Fissure Oubliée", "Le Toit Rouge",
  "La Dalle Magique", "Le Surplomb", "La Rampe", "Le Bloc Mystère", "La Cascade",
  "Le Pilier", "La Cheminée", "Le Grand Mur", "La Lame", "Le Balcon",
  "La Goutte d'Or", "Le Croissant", "La Comète", "Le Revers", "La Lune Blanche",
  "Le Dragon", "La Salamandre", "Le Papillon", "La Licorne", "Le Lynx",
  "La Panthère", "Le Faucon", "La Mésange", "Le Chamois", "La Marmotte",
  "Le Renard", "La Chouette", "Le Hibou", "La Fourmi", "Le Scarabée",
  "Le Sphinx", "La Sente", "Le Filon", "La Crête", "Le Canyon",
  "La Grotte", "Le Tunnel", "La Fenêtre", "Le Balcon Secret", "La Terrasse",
  "Le Refuge", "La Source", "Le Torrent", "La Plage", "Le Rocher Perdu",
  "La Forêt", "Le Sentier Caché"
];

// Fonction pour générer une voie d'escalade aléatoire
const generateVoie = (salleId: number) => {
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
    cotation: weightedRandom(cotations, cotationWeights),
    description: faker.helpers.arrayElement(descriptions),
    ouvreur: faker.helpers.arrayElement(ouvreurs),
    type_de_voie: faker.helpers.arrayElement(typesDeVoie),
    nom: faker.helpers.arrayElement(nomsDeVoies)
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