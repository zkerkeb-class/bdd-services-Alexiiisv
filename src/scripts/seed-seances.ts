import dotenv from "dotenv";
import { faker } from "@faker-js/faker/locale/fr";
import { supabase } from "../config/supabase";

dotenv.config();

// Fonction pour nettoyer les tables
const cleanTables = async (): Promise<void> => {
  await supabase.from("voie").delete().neq("id", 0);
  await supabase.from("seances").delete().neq("id", 0);
  console.log("✅ Tables nettoyées avec succès");
};

// Fonction pour générer une séance aléatoire
const generateSeance = (userId: number) => {
  // Générer une date aléatoire dans les 6 derniers mois
  const date = faker.date.between({
    from: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const avis = faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.7 });

  return {
    user_id: userId,
    date: date.toISOString(),
    avis: avis
  };
};

// Fonction pour générer une liaison voie-séance aléatoire
const generateVoieSeance = (seanceId: number, voieId: number) => {
  const reussie = faker.datatype.boolean();
  const avis = reussie 
    ? faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.6 })
    : faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.8 });

  return {
    seance_id: seanceId,
    voie_id: voieId,
    reussie: reussie,
    avis: avis
  };
};

// Fonction pour insérer les séances
const insertSeances = async (): Promise<void> => {
  try {
    // Nettoyer les tables avant d'insérer
    await cleanTables();

    console.log("🌱 Début de l'insertion des séances...");

    // Récupérer les IDs des utilisateurs existants
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id");

    if (usersError || !users) {
      throw usersError || new Error("Impossible de récupérer les utilisateurs");
    }

    // Récupérer les IDs des voies existantes
    const { data: voies, error: voiesError } = await supabase
      .from("voies")
      .select("id");

    if (voiesError || !voies) {
      throw voiesError || new Error("Impossible de récupérer les voies");
    }

    const userIds = users.map(user => user.id);
    const voieIds = voies.map(voie => voie.id);

    // Générer 2-5 séances par utilisateur
    const seances = [];
    const voieSeances = [];

    for (const userId of userIds) {
      const nombreSeances = faker.number.int({ min: 2, max: 5 });
      
      for (let i = 0; i < nombreSeances; i++) {
        const seance = generateSeance(userId);
        
        // Insérer la séance
        const { data: seanceData, error: seanceError } = await supabase
          .from("seances")
          .insert([seance])
          .select("id, date")
          .single();

        if (seanceError || !seanceData) {
          throw seanceError || new Error("Erreur lors de la création de la séance");
        }

        seances.push(seanceData);

        // Générer 3-8 voies par séance
        const nombreVoies = faker.number.int({ min: 3, max: 8 });
        const voiesAleatoires = faker.helpers.arrayElements(voieIds, nombreVoies);

        for (const voieId of voiesAleatoires) {
          const voieSeance = generateVoieSeance(seanceData.id, voieId);
          voieSeances.push(voieSeance);
        }

        console.log(`✅ Séance du ${new Date(seanceData.date).toLocaleDateString('fr-FR')} créée pour l'utilisateur ${userId}`);
      }
    }

    // Insérer toutes les liaisons voie-séance
    if (voieSeances.length > 0) {
      const { error: voieSeanceError } = await supabase
        .from("voie")
        .insert(voieSeances);

      if (voieSeanceError) {
        throw voieSeanceError;
      }
    }

    console.log(`✅ ${seances.length} séances ont été créées avec succès`);
    console.log(`✅ ${voieSeances.length} liaisons voie-séance ont été créées avec succès`);

    // Statistiques
    const seancesReussies = voieSeances.filter(vs => vs.reussie).length;
    const tauxReussite = ((seancesReussies / voieSeances.length) * 100).toFixed(1);
    console.log(`📊 Statistiques:`);
    console.log(`   - Taux de réussite: ${tauxReussite}%`);
    console.log(`   - Moyenne de voies par séance: ${(voieSeances.length / seances.length).toFixed(1)}`);

  } catch (err) {
    console.error("❌ Erreur lors de l'insertion des séances:", err);
  }
};

// Exécuter le script
insertSeances(); 