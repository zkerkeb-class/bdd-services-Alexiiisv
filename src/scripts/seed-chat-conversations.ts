import dotenv from "dotenv";
import { faker } from "@faker-js/faker/locale/fr";
import { supabase } from "../config/supabase";

dotenv.config();

// Fonction pour nettoyer la table chat_conversations
const cleanChatConversations = async (): Promise<void> => {
  await supabase.from("chat_conversations").delete().neq("id", 0);
  console.log("✅ Table chat_conversations nettoyée avec succès");
};

// Fonction pour générer une conversation de chat aléatoire
const generateChatConversation = (userId: number) => {
  const conversations = [
    {
      message: "Bonjour, je cherche une salle d'escalade près de Paris",
      response: "Bonjour ! Je peux vous aider à trouver une salle d'escalade à Paris. Voici quelques suggestions : Bloc & Co, Vertical Art, et Climb Up. Quelle zone préférez-vous ?"
    },
    {
      message: "Quelle est la cotation la plus difficile que vous proposez ?",
      response: "Dans nos salles partenaires, vous pouvez trouver des voies jusqu'à la cotation 9a+. La plupart des salles proposent des voies de 3a à 8c+. Quelle est votre niveau actuel ?"
    },
    {
      message: "Je débute en escalade, que me conseillez-vous ?",
      response: "Parfait pour débuter ! Je vous recommande de commencer par des voies de cotation 3a à 4c. Prenez le temps d'apprendre les techniques de base et n'hésitez pas à demander conseil aux moniteurs. Voulez-vous que je vous trouve une salle avec des cours pour débutants ?"
    },
    {
      message: "Comment améliorer ma technique de bloc ?",
      response: "Pour améliorer votre technique de bloc, je vous conseille de : 1) Travailler votre lecture de voies, 2) Pratiquer les mouvements techniques (crochets, pinces), 3) Renforcer votre gainage, 4) Varier les types de prises. Avez-vous des difficultés particulières ?"
    },
    {
      message: "Quels équipements me faut-il pour grimper ?",
      response: "Pour grimper en salle, vous aurez besoin de : chaussons d'escalade, magnésie (optionnel), baudrier (pour les voies), et un système d'assurage si vous grimpez en tête. La plupart des salles louent le matériel. Souhaitez-vous des recommandations de marques ?"
    },
    {
      message: "Je veux organiser une sortie avec des amis",
      response: "Excellente idée ! Je peux vous aider à organiser votre sortie. Combien êtes-vous ? Quel est le niveau du groupe ? Je peux vous suggérer des salles adaptées et même vous aider à réserver si nécessaire."
    },
    {
      message: "Quelle est la meilleure période pour grimper en extérieur ?",
      response: "La meilleure période pour grimper en extérieur dépend de la région. Généralement, le printemps (mars-mai) et l'automne (septembre-novembre) offrent les meilleures conditions. L'été peut être trop chaud et l'hiver trop froid. Où souhaitez-vous grimper ?"
    },
    {
      message: "Comment progresser rapidement en escalade ?",
      response: "Pour progresser rapidement : 1) Grimpez régulièrement (2-3 fois par semaine), 2) Variez les types de voies, 3) Travaillez votre technique, 4) Renforcez votre condition physique, 5) Prenez des cours. Quel est votre objectif principal ?"
    },
    {
      message: "Je me suis blessé, quand puis-je reprendre ?",
      response: "Je suis désolé d'apprendre votre blessure. Il est important de consulter un professionnel de santé avant de reprendre. La reprise doit être progressive et adaptée à votre blessure. Quel type de blessure avez-vous eu ?"
    },
    {
      message: "Pouvez-vous m'expliquer les cotations françaises ?",
      response: "Les cotations françaises vont de 1 à 9, avec des subdivisions a, b, c et +. Par exemple : 6a, 6a+, 6b, 6b+, etc. Plus le chiffre est élevé, plus la voie est difficile. Les voies 3-4 sont pour débutants, 5-6 pour intermédiaires, 7+ pour confirmés."
    }
  ];

  const conversation = faker.helpers.arrayElement(conversations);
  
  // Générer une date aléatoire dans les 3 derniers mois
  const date = faker.date.between({
    from: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  return {
    user_id: userId,
    conversation_uid: faker.string.uuid(),
    message: conversation.message,
    response: conversation.response,
    created_at: date.toISOString(),
    updated_at: date.toISOString()
  };
};

// Fonction pour insérer les conversations de chat
const insertChatConversations = async (): Promise<void> => {
  try {
    // Nettoyer la table avant d'insérer
    await cleanChatConversations();

    console.log("🌱 Début de l'insertion des conversations de chat...");

    // Récupérer les IDs des utilisateurs existants
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id");

    if (usersError || !users) {
      throw usersError || new Error("Impossible de récupérer les utilisateurs");
    }

    const userIds = users.map(user => user.id);

    // Générer 3-8 conversations par utilisateur
    const conversations = [];
    for (const userId of userIds) {
      const nombreConversations = faker.number.int({ min: 3, max: 8 });
      
      for (let i = 0; i < nombreConversations; i++) {
        const conversation = generateChatConversation(userId);
        conversations.push(conversation);
      }
    }

    // Insérer toutes les conversations
    const { error: conversationsError } = await supabase
      .from("chat_conversations")
      .insert(conversations);

    if (conversationsError) {
      throw conversationsError;
    }

    console.log(`✅ ${conversations.length} conversations de chat ont été créées avec succès`);
    console.log(`✅ Répartition par utilisateur:`);
    
    for (const userId of userIds) {
      const conversationsUtilisateur = conversations.filter(conv => conv.user_id === userId).length;
      console.log(`   - Utilisateur ${userId}: ${conversationsUtilisateur} conversations`);
    }

    // Statistiques des types de messages
    const typesMessages = conversations.map(conv => {
      if (conv.message.includes("salle")) return "Recherche de salle";
      if (conv.message.includes("cotation")) return "Question technique";
      if (conv.message.includes("début")) return "Débutant";
      if (conv.message.includes("technique")) return "Conseil technique";
      if (conv.message.includes("équipement")) return "Matériel";
      if (conv.message.includes("sortie")) return "Organisation";
      if (conv.message.includes("extérieur")) return "Escalade extérieure";
      if (conv.message.includes("progresser")) return "Progression";
      if (conv.message.includes("bless")) return "Blessure";
      if (conv.message.includes("cotation")) return "Explication cotations";
      return "Autre";
    });

    const stats = typesMessages.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`📊 Types de conversations:`);
    Object.entries(stats).forEach(([type, count]) => {
      const pourcentage = ((count / conversations.length) * 100).toFixed(1);
      console.log(`   - ${type}: ${count} (${pourcentage}%)`);
    });

  } catch (err) {
    console.error("❌ Erreur lors de l'insertion des conversations de chat:", err);
  }
};

// Exécuter le script
insertChatConversations(); 