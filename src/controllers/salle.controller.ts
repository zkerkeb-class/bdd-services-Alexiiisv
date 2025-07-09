import { Request, Response } from 'express';
import { salleService, Salle } from '../services/supabase.service';
import { supabase } from '../config/supabase';

export class SalleController {
  // GET /api/salles
  static async getAllSalles(req: Request, res: Response) {
    try {
      // Récupérer les salles avec le nombre de voies
      const { data: salles, error } = await supabase
        .from('salles')
        .select(`
          *,
          voies (count)
        `);

      if (error) {
        console.error('Error fetching salles:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch salles' 
        });
      }

      // Transformer les données pour inclure le nombre de voies
      const sallesWithVoieCount = salles?.map(salle => ({
        ...salle,
        nombre_voies: salle.voies?.[0]?.count || 0
      })) || [];

      res.json({ success: true, data: sallesWithVoieCount });
    } catch (error) {
      console.error('Error fetching salles:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch salles' 
      });
    }
  }

  // GET /api/salles/:id
  static async getSalleById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid salle ID' 
        });
      }

      const salle = await salleService.getById(id);
      if (!salle) {
        return res.status(404).json({ 
          success: false, 
          error: 'Salle not found' 
        });
      }

      res.json({ success: true, data: salle });
    } catch (error) {
      console.error('Error fetching salle:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch salle' 
      });
    }
  }

  // GET /api/salles/:id/voies
  static async getSalleWithVoies(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid salle ID' 
        });
      }

      // Récupérer la salle avec ses voies et sa localisation
      const { data: salle, error: salleError } = await supabase
        .from('salles')
        .select(`
          *,
          voies (*),
          localisation:localisation (latitude, longitude)
        `)
        .eq('id', id)
        .single();

      if (salleError || !salle) {
        return res.status(404).json({ 
          success: false, 
          error: 'Salle not found' 
        });
      }

      res.json({ success: true, data: salle });
    } catch (error) {
      console.error('Error fetching salle with voies:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch salle with voies' 
      });
    }
  }

  // POST /api/salles
  static async createSalle(req: Request, res: Response) {
    try {
      const { nom, description, email, telephone, admin_id, localisation } = req.body;

      // Validation
      if (!nom) {
        return res.status(400).json({ 
          success: false, 
          error: 'Nom is required' 
        });
      }

      const salleData: Partial<Salle> = {
        nom,
        description,
        email,
        telephone,
        admin_id,
        localisation
      };

      const newSalle = await salleService.create(salleData);
      res.status(201).json({ success: true, data: newSalle });
    } catch (error) {
      console.error('Error creating salle:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create salle' 
      });
    }
  }

  // PUT /api/salles/:id
  static async updateSalle(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid salle ID' 
        });
      }

      const { nom, description, email, telephone, admin_id, localisation } = req.body;
      const updateData: Partial<Salle> = {};

      if (nom) updateData.nom = nom;
      if (description !== undefined) updateData.description = description;
      if (email !== undefined) updateData.email = email;
      if (telephone !== undefined) updateData.telephone = telephone;
      if (admin_id !== undefined) updateData.admin_id = admin_id;
      if (localisation !== undefined) updateData.localisation = localisation;

      const updatedSalle = await salleService.update(id, updateData);
      if (!updatedSalle) {
        return res.status(404).json({ 
          success: false, 
          error: 'Salle not found' 
        });
      }

      res.json({ success: true, data: updatedSalle });
    } catch (error) {
      console.error('Error updating salle:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update salle' 
      });
    }
  }

  // DELETE /api/salles/:id
  static async deleteSalle(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid salle ID' 
        });
      }

      await salleService.delete(id);
      res.json({ success: true, message: 'Salle deleted successfully' });
    } catch (error) {
      console.error('Error deleting salle:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete salle' 
      });
    }
  }

  // GET /api/salles/search?field=value
  static async searchSalles(req: Request, res: Response) {
    try {
      const filters = req.query;
      const salles = await salleService.query(filters);
      res.json({ success: true, data: salles });
    } catch (error) {
      console.error('Error searching salles:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to search salles' 
      });
    }
  }
} 