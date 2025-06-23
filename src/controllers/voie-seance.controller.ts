import { Request, Response } from 'express';
import { voieSeanceService, VoieSeance } from '../services/supabase.service';
import { supabase } from '../config/supabase';

export class VoieSeanceController {
  // GET /api/voie-seances
  static async getAllVoieSeances(req: Request, res: Response) {
    try {
      const voieSeances = await voieSeanceService.getAll();
      res.json({ success: true, data: voieSeances });
    } catch (error) {
      console.error('Error fetching voie-seances:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch voie-seances' 
      });
    }
  }

  // GET /api/voie-seances/:id
  static async getVoieSeanceById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid voie-seance ID' 
        });
      }

      const voieSeance = await voieSeanceService.getById(id);
      if (!voieSeance) {
        return res.status(404).json({ 
          success: false, 
          error: 'Voie-seance not found' 
        });
      }

      res.json({ success: true, data: voieSeance });
    } catch (error) {
      console.error('Error fetching voie-seance:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch voie-seance' 
      });
    }
  }

  // GET /api/voie-seances/seance/:seanceId
  static async getVoieSeancesBySeanceId(req: Request, res: Response) {
    try {
      const seanceId = parseInt(req.params.seanceId);
      if (isNaN(seanceId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid seance ID' 
        });
      }

      const voieSeances = await voieSeanceService.query({ seance_id: seanceId });
      res.json({ success: true, data: voieSeances });
    } catch (error) {
      console.error('Error fetching voie-seances by seance ID:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch voie-seances by seance ID' 
      });
    }
  }

  // GET /api/voie-seances/voie/:voieId
  static async getVoieSeancesByVoieId(req: Request, res: Response) {
    try {
      const voieId = parseInt(req.params.voieId);
      if (isNaN(voieId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid voie ID' 
        });
      }

      const voieSeances = await voieSeanceService.query({ voie_id: voieId });
      res.json({ success: true, data: voieSeances });
    } catch (error) {
      console.error('Error fetching voie-seances by voie ID:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch voie-seances by voie ID' 
      });
    }
  }

  // GET /api/voie-seances/seance/:seanceId/complete
  static async getSeanceWithVoieDetails(req: Request, res: Response) {
    try {
      const seanceId = parseInt(req.params.seanceId);
      if (isNaN(seanceId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid seance ID' 
        });
      }

      // Récupérer les voies de la séance avec les détails
      const { data: voieSeances, error } = await supabase
        .from('voie')
        .select(`
          *,
          voies (*)
        `)
        .eq('seance_id', seanceId);

      if (error) {
        throw error;
      }

      res.json({ success: true, data: voieSeances || [] });
    } catch (error) {
      console.error('Error fetching seance with voie details:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch seance with voie details' 
      });
    }
  }

  // POST /api/voie-seances
  static async createVoieSeance(req: Request, res: Response) {
    try {
      const { seance_id, voie_id, reussie, avis } = req.body;

      // Validation
      if (!seance_id || !voie_id) {
        return res.status(400).json({ 
          success: false, 
          error: 'Seance ID and voie ID are required' 
        });
      }

      const voieSeanceData: Partial<VoieSeance> = {
        seance_id,
        voie_id,
        reussie,
        avis
      };

      const newVoieSeance = await voieSeanceService.create(voieSeanceData);
      res.status(201).json({ success: true, data: newVoieSeance });
    } catch (error) {
      console.error('Error creating voie-seance:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create voie-seance' 
      });
    }
  }

  // POST /api/voie-seances/batch
  static async createMultipleVoieSeances(req: Request, res: Response) {
    try {
      const { voieSeances } = req.body;

      if (!Array.isArray(voieSeances) || voieSeances.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'VoieSeances array is required' 
        });
      }

      // Validation des données
      for (const voieSeance of voieSeances) {
        if (!voieSeance.seance_id || !voieSeance.voie_id) {
          return res.status(400).json({ 
            success: false, 
            error: 'Each voie-seance must have seance_id and voie_id' 
          });
        }
      }

      const { data: newVoieSeances, error } = await supabase
        .from('voie')
        .insert(voieSeances)
        .select();

      if (error) {
        throw error;
      }

      res.status(201).json({ success: true, data: newVoieSeances });
    } catch (error) {
      console.error('Error creating multiple voie-seances:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create multiple voie-seances' 
      });
    }
  }

  // PUT /api/voie-seances/:id
  static async updateVoieSeance(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid voie-seance ID' 
        });
      }

      const { reussie, avis } = req.body;
      const updateData: Partial<VoieSeance> = {};

      if (reussie !== undefined) updateData.reussie = reussie;
      if (avis !== undefined) updateData.avis = avis;

      const updatedVoieSeance = await voieSeanceService.update(id, updateData);
      if (!updatedVoieSeance) {
        return res.status(404).json({ 
          success: false, 
          error: 'Voie-seance not found' 
        });
      }

      res.json({ success: true, data: updatedVoieSeance });
    } catch (error) {
      console.error('Error updating voie-seance:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update voie-seance' 
      });
    }
  }

  // DELETE /api/voie-seances/:id
  static async deleteVoieSeance(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid voie-seance ID' 
        });
      }

      await voieSeanceService.delete(id);
      res.json({ success: true, message: 'Voie-seance deleted successfully' });
    } catch (error) {
      console.error('Error deleting voie-seance:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete voie-seance' 
      });
    }
  }

  // DELETE /api/voie-seances/seance/:seanceId
  static async deleteAllVoieSeancesBySeance(req: Request, res: Response) {
    try {
      const seanceId = parseInt(req.params.seanceId);
      if (isNaN(seanceId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid seance ID' 
        });
      }

      const { error } = await supabase
        .from('voie')
        .delete()
        .eq('seance_id', seanceId);

      if (error) {
        throw error;
      }

      res.json({ success: true, message: 'All voie-seances for this seance deleted successfully' });
    } catch (error) {
      console.error('Error deleting all voie-seances by seance:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete all voie-seances by seance' 
      });
    }
  }

  // GET /api/voie-seances/search?field=value
  static async searchVoieSeances(req: Request, res: Response) {
    try {
      const filters = req.query;
      const voieSeances = await voieSeanceService.query(filters);
      res.json({ success: true, data: voieSeances });
    } catch (error) {
      console.error('Error searching voie-seances:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to search voie-seances' 
      });
    }
  }

  // GET /api/voie-seances/stats/user/:userId
  static async getUserVoieStats(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid user ID' 
        });
      }

      // Récupérer les statistiques des voies de l'utilisateur
      const { data: voieSeances, error } = await supabase
        .from('voie')
        .select(`
          *,
          seances!inner(user_id),
          voies (*)
        `)
        .eq('seances.user_id', userId);

      if (error) {
        throw error;
      }

      // Calculer les statistiques
      const totalVoies = voieSeances?.length || 0;
      const voiesReussies = voieSeances?.filter(vs => vs.reussie).length || 0;
      const tauxReussite = totalVoies > 0 ? (voiesReussies / totalVoies) * 100 : 0;

      const stats = {
        totalVoies,
        voiesReussies,
        voiesRatees: totalVoies - voiesReussies,
        tauxReussite: Math.round(tauxReussite * 100) / 100,
        voies: voieSeances || []
      };

      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Error fetching user voie stats:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch user voie stats' 
      });
    }
  }
} 