import dotenv from "dotenv";
import { faker } from "@faker-js/faker/locale/fr";
import { supabase } from "../config/supabase";

dotenv.config();

// Fonction pour nettoyer la table logs
const cleanLogs = async (): Promise<void> => {
  await supabase.from("http_logs").delete().neq("id", 0);
  console.log("✅ Table logs nettoyée avec succès");
};

// Fonction pour générer un log HTTP aléatoire
const generateHttpLog = () => {
  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  const statusCodes = [200, 201, 400, 401, 403, 404, 500];
  const urls = [
    "/api/users",
    "/api/profiles",
    "/api/sessions",
    "/api/salles",
    "/api/voies",
    "/api/seances",
    "/api/chat-conversations",
    "/api/auth/login",
    "/api/auth/register",
    "/api/health"
  ];

  return {
    method: faker.helpers.arrayElement(methods),
    url: faker.helpers.arrayElement(urls),
    status_code: faker.helpers.arrayElement(statusCodes),
    response_time_ms: faker.number.float({ min: 10, max: 2000, precision: 0.1 }),
    content_length: faker.number.int({ min: 0, max: 10000 }),
    user_id: faker.number.int({ min: 1, max: 10 }),
    ip_address: faker.internet.ip(),
    user_agent: faker.internet.userAgent(),
    referrer: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.7 }),
    error_message: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.1 }),
    log_type: "http",
    email_type: null,
    user_email: null,
    notification_id: null
  };
};

// Fonction pour générer un log email aléatoire
const generateEmailLog = () => {
  const emailTypes = ["welcome", "password_reset", "notification", "confirmation"];
  const statusCodes = [200, 400, 500];

  return {
    method: "POST",
    url: "/api/notifications/email",
    status_code: faker.helpers.arrayElement(statusCodes),
    response_time_ms: faker.number.float({ min: 100, max: 5000, precision: 0.1 }),
    content_length: faker.number.int({ min: 0, max: 1000 }),
    user_id: faker.number.int({ min: 1, max: 10 }),
    ip_address: faker.internet.ip(),
    user_agent: faker.internet.userAgent(),
    referrer: null,
    error_message: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.2 }),
    log_type: "email",
    email_type: faker.helpers.arrayElement(emailTypes),
    user_email: faker.internet.email(),
    notification_id: faker.string.uuid()
  };
};

// Générer 100 logs HTTP et 50 logs email
const httpLogs = Array.from({ length: 100 }, generateHttpLog);
const emailLogs = Array.from({ length: 50 }, generateEmailLog);

// Fonction pour insérer les logs
const insertLogs = async (): Promise<void> => {
  try {
    // Nettoyer la table avant d'insérer
    await cleanLogs();

    console.log("🌱 Début de l'insertion des logs...");

    // Insérer les logs HTTP
    const { error: httpError } = await supabase
      .from("http_logs")
      .insert(httpLogs);

    if (httpError) {
      throw httpError;
    }

    console.log(`✅ ${httpLogs.length} logs HTTP insérés avec succès`);

    // Insérer les logs email
    const { error: emailError } = await supabase
      .from("http_logs")
      .insert(emailLogs);

    if (emailError) {
      throw emailError;
    }

    console.log(`✅ ${emailLogs.length} logs email insérés avec succès`);
    console.log("✅ Tous les logs ont été créés avec succès");

  } catch (err) {
    console.error("❌ Erreur lors de l'insertion des logs:", err);
  }
};

// Exécuter le script
insertLogs(); 