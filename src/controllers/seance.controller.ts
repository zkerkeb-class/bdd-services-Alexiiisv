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
      const { user_id, date, avis, salle_id } = req.body;

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
        avis,
        salle_id
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

  // GET /api/seances/user/:userId/stats
  static async getUserStats(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid user ID' 
        });
      }

      // Récupérer toutes les séances de l'utilisateur avec leurs voies
      const { data: seances, error: seancesError } = await supabase
      .from('seances')
      .select(`
        *,
        voie (
          *,
          voies (*)
        )
      `)
      .eq('user_id', userId);

      if (seancesError) {
        throw seancesError;
      }

      if (!seances || seances.length === 0) {
        return res.json({
          success: true,
          data: {
            ascensions: 0,
            sallesVisitees: 0,
            niveauMax: null,
            joursGrimpe: 0
          }
        });
      }

      // Calculer les statistiques
      let ascensions = 0;
      const sallesVisitees = new Set<number>();
      const cotationsReussies: string[] = [];
      const joursGrimpe = new Set<string>();

      seances.forEach(seance => {
        // Compter les jours de grimpe (1 par jour)
        const dateJour = seance.date.split('T')[0];
        joursGrimpe.add(dateJour);

        // Compter les salles visitées
        if (seance.salle_id) {
          sallesVisitees.add(seance.salle_id);
        }

        // Compter les voies réussies et récupérer les cotations
        if (seance.voie) {
          seance.voie.forEach((voieSeance: any) => {
            if (voieSeance.reussie) {
              ascensions++;
              if (voieSeance.voies && voieSeance.voies.cotation) {
                cotationsReussies.push(voieSeance.voies.cotation);
              }
            }
          });
        }
      });

      // Fonction pour comparer les cotations
      const compareCotation = (a: string, b: string): number => {
        const grades = [
          '3a', '3a+', '3b', '3b+', '3c', '3c+',
          '4a', '4a+', '4b', '4b+', '4c', '4c+',
          '5a', '5a+', '5b', '5b+', '5c', '5c+',
          '6a', '6a+', '6b', '6b+', '6c', '6c+',
          '7a', '7a+', '7b', '7b+', '7c', '7c+',
          '8a', '8a+', '8b', '8b+', '8c', '8c+',
          '9a', '9a+', '9b', '9b+', '9c', '9c+'
        ];
        const indexA = grades.indexOf(a.toLowerCase());
        const indexB = grades.indexOf(b.toLowerCase());
        return indexA - indexB;
      };

      // Trouver le niveau max
      const niveauMax = cotationsReussies.length > 0 
        ? cotationsReussies.reduce((max, current) => 
            compareCotation(current, max) > 0 ? current : max
          )
        : null;

        console.log(niveauMax);

      res.json({
        success: true,
        data: {
          ascensions,
          sallesVisitees: sallesVisitees.size,
          niveauMax,
          joursGrimpe: joursGrimpe.size
        }
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch user stats' 
      });
    }
  }
} 