import { Request, Response } from 'express';
import { voieService, Voie } from '../services/supabase.service';

export class VoieController {
  // GET /api/voies
  static async getAllVoies(req: Request, res: Response) {
    try {
      const voies = await voieService.getAll();
      res.json({ success: true, data: voies });
    } catch (error) {
      console.error('Error fetching voies:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch voies' 
      });
    }
  }

  // GET /api/voies/:id
  static async getVoieById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid voie ID' 
        });
      }

      const voie = await voieService.getById(id);
      if (!voie) {
        return res.status(404).json({ 
          success: false, 
          error: 'Voie not found' 
        });
      }

      res.json({ success: true, data: voie });
    } catch (error) {
      console.error('Error fetching voie:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch voie' 
      });
    }
  }

  // GET /api/voies/salle/:salleId
  static async getVoiesBySalle(req: Request, res: Response) {
    try {
      const salleId = parseInt(req.params.salleId);
      if (isNaN(salleId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid salle ID' 
        });
      }

      const voies = await voieService.query({ salle_id: salleId });
      res.json({ success: true, data: voies });
    } catch (error) {
      console.error('Error fetching voies by salle:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch voies by salle' 
      });
    }
  }

  // POST /api/voies
  static async createVoie(req: Request, res: Response) {
    try {
      const { salle_id, cotation, description, ouvreur, type_de_voie } = req.body;

      // Validation
      if (!salle_id) {
        return res.status(400).json({ 
          success: false, 
          error: 'Salle ID is required' 
        });
      }

      const voieData: Partial<Voie> = {
        salle_id,
        cotation,
        description,
        ouvreur,
        type_de_voie
      };

      const newVoie = await voieService.create(voieData);
      res.status(201).json({ success: true, data: newVoie });
    } catch (error) {
      console.error('Error creating voie:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create voie' 
      });
    }
  }

  // PUT /api/voies/:id
  static async updateVoie(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid voie ID' 
        });
      }

      const { cotation, description, ouvreur, type_de_voie } = req.body;
      const updateData: Partial<Voie> = {};

      if (cotation !== undefined) updateData.cotation = cotation;
      if (description !== undefined) updateData.description = description;
      if (ouvreur !== undefined) updateData.ouvreur = ouvreur;
      if (type_de_voie !== undefined) updateData.type_de_voie = type_de_voie;

      const updatedVoie = await voieService.update(id, updateData);
      if (!updatedVoie) {
        return res.status(404).json({ 
          success: false, 
          error: 'Voie not found' 
        });
      }

      res.json({ success: true, data: updatedVoie });
    } catch (error) {
      console.error('Error updating voie:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update voie' 
      });
    }
  }

  // DELETE /api/voies/:id
  static async deleteVoie(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid voie ID' 
        });
      }

      await voieService.delete(id);
      res.json({ success: true, message: 'Voie deleted successfully' });
    } catch (error) {
      console.error('Error deleting voie:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete voie' 
      });
    }
  }

  // GET /api/voies/search?field=value
  static async searchVoies(req: Request, res: Response) {
    try {
      const filters = req.query;
      const voies = await voieService.query(filters);
      res.json({ success: true, data: voies });
    } catch (error) {
      console.error('Error searching voies:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to search voies' 
      });
    }
  }
} 