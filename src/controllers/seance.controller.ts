import { Request, Response } from 'express';
import { seanceService, Seance } from '../services/supabase.service';
import { supabase } from '../config/supabase';

export class SeanceController {
  // GET /api/seances
  static async getAllSeances(req: Request, res: Response) {
    try {
      const seances = await seanceService.getAll();
      res.json({ success: true, data: seances });
    } catch (error) {
      console.error('Error fetching seances:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch seances' 
      });
    }
  }

  // GET /api/seances/:id
  static async getSeanceById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid seance ID' 
        });
      }

      const seance = await seanceService.getById(id);
      if (!seance) {
        return res.status(404).json({ 
          success: false, 
          error: 'Seance not found' 
        });
      }

      res.json({ success: true, data: seance });
    } catch (error) {
      console.error('Error fetching seance:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch seance' 
      });
    }
  }

  // GET /api/seances/user/:userId
  static async getSeancesByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid user ID' 
        });
      }

      const seances = await seanceService.query({ user_id: userId });
      res.json({ success: true, data: seances });
    } catch (error) {
      console.error('Error fetching seances by user ID:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch seances by user ID' 
      });
    }
  }

  // GET /api/seances/:id/complete
  static async getSeanceWithVoies(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid seance ID' 
        });
      }

      // Récupérer la séance avec ses voies
      const { data: seance, error: seanceError } = await supabase
        .from('seances')
        .select(`
          *,
          voie (
            *,
            voies (*)
          )
        `)
        .eq('id', id)
        .single();

      if (seanceError || !seance) {
        return res.status(404).json({ 
          success: false, 
          error: 'Seance not found' 
        });
      }

      res.json({ success: true, data: seance });
    } catch (error) {
      console.error('Error fetching seance with voies:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch seance with voies' 
      });
    }
  }

  // POST /api/seances
  static async createSeance(req: Request, res: Response) {
    try {
      const { user_id, date, avis } = req.body;

      // Validation
      if (!user_id || !date) {
        return res.status(400).json({ 
          success: false, 
          error: 'User ID and date are required' 
        });
      }

      // Validation de la date
      const seanceDate = new Date(date);
      if (isNaN(seanceDate.getTime())) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid date format' 
        });
      }

      const seanceData: Partial<Seance> = {
        user_id,
        date: seanceDate.toISOString(),
        avis
      };

      const newSeance = await seanceService.create(seanceData);
      res.status(201).json({ success: true, data: newSeance });
    } catch (error) {
      console.error('Error creating seance:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create seance' 
      });
    }
  }

  // PUT /api/seances/:id
  static async updateSeance(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid seance ID' 
        });
      }

      const { date, avis } = req.body;
      const updateData: Partial<Seance> = {};

      if (date !== undefined) {
        const seanceDate = new Date(date);
        if (isNaN(seanceDate.getTime())) {
          return res.status(400).json({ 
            success: false, 
            error: 'Invalid date format' 
          });
        }
        updateData.date = seanceDate.toISOString();
      }

      if (avis !== undefined) updateData.avis = avis;

      const updatedSeance = await seanceService.update(id, updateData);
      if (!updatedSeance) {
        return res.status(404).json({ 
          success: false, 
          error: 'Seance not found' 
        });
      }

      res.json({ success: true, data: updatedSeance });
    } catch (error) {
      console.error('Error updating seance:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update seance' 
      });
    }
  }

  // DELETE /api/seances/:id
  static async deleteSeance(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid seance ID' 
        });
      }

      await seanceService.delete(id);
      res.json({ success: true, message: 'Seance deleted successfully' });
    } catch (error) {
      console.error('Error deleting seance:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete seance' 
      });
    }
  }

  // GET /api/seances/search?field=value
  static async searchSeances(req: Request, res: Response) {
    try {
      const filters = req.query;
      const seances = await seanceService.query(filters);
      res.json({ success: true, data: seances });
    } catch (error) {
      console.error('Error searching seances:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to search seances' 
      });
    }
  }

  // GET /api/seances/date-range?start=date&end=date
  static async getSeancesByDateRange(req: Request, res: Response) {
    try {
      const startDate = req.query.start as string;
      const endDate = req.query.end as string;

      if (!startDate || !endDate) {
        return res.status(400).json({ 
          success: false, 
          error: 'Start and end dates are required' 
        });
      }

      const { data: seances, error } = await supabase
        .from('seances')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) {
        throw error;
      }

      res.json({ success: true, data: seances || [] });
    } catch (error) {
      console.error('Error fetching seances by date range:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch seances by date range' 
      });
    }
  }
} 