import dotenv from "dotenv";
import { exec } from "child_process";
import { promisify } from "util";

dotenv.config();

const execAsync = promisify(exec);

// Ordre d'exécution des seeds (selon les dépendances)
const seeds = [
  "seed-users.ts",
  "seed-salles.ts", 
  "seed-voies.ts",
  "seed-seances.ts",
  "seed-chat-conversations.ts",
  "seed-logs.ts"
];

// Fonction pour exécuter un script de seed
const runSeed = async (scriptName: string): Promise<void> => {
  try {
    console.log(`\n🌱 Exécution de ${scriptName}...`);
    console.log("=".repeat(50));
    
    const { stdout, stderr } = await execAsync(`npx ts-node src/scripts/${scriptName}`);
    
    if (stdout) {
      console.log(stdout);
    }
    
    if (stderr) {
      console.error(stderr);
    }
    
    console.log(`✅ ${scriptName} terminé avec succès`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'exécution de ${scriptName}:`, error);
    throw error;
  }
};

// Fonction principale pour exécuter tous les seeds
const runAllSeeds = async (): Promise<void> => {
  try {
    console.log("🚀 Début de l'exécution de tous les seeds...");
    console.log("📋 Ordre d'exécution:");
    seeds.forEach((seed, index) => {
      console.log(`   ${index + 1}. ${seed}`);
    });
    
    for (const seed of seeds) {
      await runSeed(seed);
      
      // Petite pause entre les seeds pour éviter les conflits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log("\n🎉 Tous les seeds ont été exécutés avec succès !");
    console.log("\n📊 Résumé de la base de données:");
    console.log("   - Utilisateurs et profils");
    console.log("   - Salles d'escalade avec localisations");
    console.log("   - Voies d'escalade");
    console.log("   - Séances et liaisons voie-séance");
    console.log("   - Conversations de chat");
    console.log("   - Logs HTTP et email");
    
  } catch (error) {
    console.error("❌ Erreur lors de l'exécution des seeds:", error);
    process.exit(1);
  }
};

// Exécuter si le script est appelé directement
if (require.main === module) {
  runAllSeeds();
}

export { runAllSeeds }; 