import express, { Router, Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import { ProfileController } from "../controllers/profile.controller";
import { LocalisationController } from "../controllers/localisation.controller";
import { SessionController } from "../controllers/session.controller";
import { SalleController } from "../controllers/salle.controller";
import { VoieController } from "../controllers/voie.controller";
import { SeanceController } from "../controllers/seance.controller";
import { VoieSeanceController } from "../controllers/voie-seance.controller";
import { supabase } from "../config/supabase";

const router: Router = express.Router();

// Route de test pour vérifier la connexion Supabase
router.get("/test", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    
    res.json({
      message: "Supabase connection successful",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Supabase connection error" });
  }
});

// Routes CRUD pour les utilisateurs
router.get("/users", UserController.getAllUsers);
router.get("/users/search", UserController.searchUsers);
router.get("/users/:id", UserController.getUserById);
router.post("/users", UserController.createUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

// Routes CRUD pour les profils
router.get("/profiles", ProfileController.getAllProfiles);
router.get("/profiles/search", ProfileController.searchProfiles);
router.get("/profiles/:id", ProfileController.getProfileById);
router.get("/profiles/user/:userId", ProfileController.getProfileByUserId);
router.get("/profiles/user/:userId/complete", ProfileController.getUserWithProfile);
router.post("/profiles", ProfileController.createProfile);
router.put("/profiles/:id", ProfileController.updateProfile);
router.delete("/profiles/:id", ProfileController.deleteProfile);

// Routes CRUD pour les localisations
router.get("/localisations", LocalisationController.getAllLocalisations);
router.get("/localisations/search", LocalisationController.searchLocalisations);
router.get("/localisations/nearby", LocalisationController.getNearbyLocalisations);
router.get("/localisations/:id", LocalisationController.getLocalisationById);
router.get("/localisations/:id/salles", LocalisationController.getLocalisationWithSalles);
router.post("/localisations", LocalisationController.createLocalisation);
router.put("/localisations/:id", LocalisationController.updateLocalisation);
router.delete("/localisations/:id", LocalisationController.deleteLocalisation);

// Routes CRUD pour les sessions
router.get("/sessions", SessionController.getAllSessions);
router.get("/sessions/search", SessionController.searchSessions);
router.get("/sessions/active", SessionController.getActiveSessions);
router.get("/sessions/:id", SessionController.getSessionById);
router.get("/sessions/user/:userId", SessionController.getSessionsByUserId);
router.post("/sessions", SessionController.createSession);
router.post("/sessions/validate", SessionController.validateSession);
router.put("/sessions/:id", SessionController.updateSession);
router.delete("/sessions/:id", SessionController.deleteSession);
router.delete("/sessions/user/:userId", SessionController.deleteAllUserSessions);

// Routes CRUD pour les salles
router.get("/salles", SalleController.getAllSalles);
router.get("/salles/search", SalleController.searchSalles);
router.get("/salles/:id", SalleController.getSalleById);
router.get("/salles/:id/voies", SalleController.getSalleWithVoies);
router.post("/salles", SalleController.createSalle);
router.put("/salles/:id", SalleController.updateSalle);
router.delete("/salles/:id", SalleController.deleteSalle);

// Routes CRUD pour les voies
router.get("/voies", VoieController.getAllVoies);
router.get("/voies/search", VoieController.searchVoies);
router.get("/voies/:id", VoieController.getVoieById);
router.get("/voies/salle/:salleId", VoieController.getVoiesBySalle);
router.post("/voies", VoieController.createVoie);
router.put("/voies/:id", VoieController.updateVoie);
router.delete("/voies/:id", VoieController.deleteVoie);

// Routes CRUD pour les séances
router.get("/seances", SeanceController.getAllSeances);
router.get("/seances/search", SeanceController.searchSeances);
router.get("/seances/date-range", SeanceController.getSeancesByDateRange);
router.get("/seances/:id", SeanceController.getSeanceById);
router.get("/seances/:id/complete", SeanceController.getSeanceWithVoies);
router.get("/seances/user/:userId", SeanceController.getSeancesByUserId);
router.post("/seances", SeanceController.createSeance);
router.put("/seances/:id", SeanceController.updateSeance);
router.delete("/seances/:id", SeanceController.deleteSeance);

// Routes CRUD pour les liaisons voie-séance
router.get("/voie-seances", VoieSeanceController.getAllVoieSeances);
router.get("/voie-seances/search", VoieSeanceController.searchVoieSeances);
router.get("/voie-seances/stats/user/:userId", VoieSeanceController.getUserVoieStats);
router.get("/voie-seances/:id", VoieSeanceController.getVoieSeanceById);
router.get("/voie-seances/seance/:seanceId", VoieSeanceController.getVoieSeancesBySeanceId);
router.get("/voie-seances/seance/:seanceId/complete", VoieSeanceController.getSeanceWithVoieDetails);
router.get("/voie-seances/voie/:voieId", VoieSeanceController.getVoieSeancesByVoieId);
router.post("/voie-seances", VoieSeanceController.createVoieSeance);
router.post("/voie-seances/batch", VoieSeanceController.createMultipleVoieSeances);
router.put("/voie-seances/:id", VoieSeanceController.updateVoieSeance);
router.delete("/voie-seances/:id", VoieSeanceController.deleteVoieSeance);
router.delete("/voie-seances/seance/:seanceId", VoieSeanceController.deleteAllVoieSeancesBySeance);

export default router;
