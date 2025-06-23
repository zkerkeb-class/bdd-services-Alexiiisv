import { Request, Response } from 'express';
import { localisationService, Localisation } from '../services/supabase.service';
import { supabase } from '../config/supabase';

export class LocalisationController {
  // GET /api/localisations
  static async getAllLocalisations(req: Request, res: Response) {
    try {
      const localisations = await localisationService.getAll();
      res.json({ success: true, data: localisations });
    } catch (error) {
      console.error('Error fetching localisations:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch localisations' 
      });
    }
  }

  // GET /api/localisations/:id
  static async getLocalisationById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid localisation ID' 
        });
      }

      const localisation = await localisationService.getById(id);
      if (!localisation) {
        return res.status(404).json({ 
          success: false, 
          error: 'Localisation not found' 
        });
      }

      res.json({ success: true, data: localisation });
    } catch (error) {
      console.error('Error fetching localisation:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch localisation' 
      });
    }
  }

  // GET /api/localisations/:id/salles
  static async getLocalisationWithSalles(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid localisation ID' 
        });
      }

      // Récupérer la localisation avec les salles associées
      const { data: localisation, error: localisationError } = await supabase
        .from('localisation')
        .select(`
          *,
          salles (*)
        `)
        .eq('id', id)
        .single();

      if (localisationError || !localisation) {
        return res.status(404).json({ 
          success: false, 
          error: 'Localisation not found' 
        });
      }

      res.json({ success: true, data: localisation });
    } catch (error) {
      console.error('Error fetching localisation with salles:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch localisation with salles' 
      });
    }
  }

  // POST /api/localisations
  static async createLocalisation(req: Request, res: Response) {
    try {
      const { latitude, longitude } = req.body;

      // Validation
      if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ 
          success: false, 
          error: 'Latitude and longitude are required' 
        });
      }

      // Validation des coordonnées
      if (latitude < -90 || latitude > 90) {
        return res.status(400).json({ 
          success: false, 
          error: 'Latitude must be between -90 and 90' 
        });
      }

      if (longitude < -180 || longitude > 180) {
        return res.status(400).json({ 
          success: false, 
          error: 'Longitude must be between -180 and 180' 
        });
      }

      const localisationData: Partial<Localisation> = {
        latitude,
        longitude
      };

      const newLocalisation = await localisationService.create(localisationData);
      res.status(201).json({ success: true, data: newLocalisation });
    } catch (error) {
      console.error('Error creating localisation:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create localisation' 
      });
    }
  }

  // PUT /api/localisations/:id
  static async updateLocalisation(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid localisation ID' 
        });
      }

      const { latitude, longitude } = req.body;
      const updateData: Partial<Localisation> = {};

      if (latitude !== undefined) {
        if (latitude < -90 || latitude > 90) {
          return res.status(400).json({ 
            success: false, 
            error: 'Latitude must be between -90 and 90' 
          });
        }
        updateData.latitude = latitude;
      }

      if (longitude !== undefined) {
        if (longitude < -180 || longitude > 180) {
          return res.status(400).json({ 
            success: false, 
            error: 'Longitude must be between -180 and 180' 
          });
        }
        updateData.longitude = longitude;
      }

      const updatedLocalisation = await localisationService.update(id, updateData);
      if (!updatedLocalisation) {
        return res.status(404).json({ 
          success: false, 
          error: 'Localisation not found' 
        });
      }

      res.json({ success: true, data: updatedLocalisation });
    } catch (error) {
      console.error('Error updating localisation:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update localisation' 
      });
    }
  }

  // DELETE /api/localisations/:id
  static async deleteLocalisation(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid localisation ID' 
        });
      }

      await localisationService.delete(id);
      res.json({ success: true, message: 'Localisation deleted successfully' });
    } catch (error) {
      console.error('Error deleting localisation:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete localisation' 
      });
    }
  }

  // GET /api/localisations/search?field=value
  static async searchLocalisations(req: Request, res: Response) {
    try {
      const filters = req.query;
      const localisations = await localisationService.query(filters);
      res.json({ success: true, data: localisations });
    } catch (error) {
      console.error('Error searching localisations:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to search localisations' 
      });
    }
  }

  // GET /api/localisations/nearby?lat=latitude&lng=longitude&radius=km
  static async getNearbyLocalisations(req: Request, res: Response) {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = parseFloat(req.query.radius as string) || 10; // 10km par défaut

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Valid latitude and longitude are required' 
        });
      }

      // Calcul approximatif de la distance (formule de Haversine simplifiée)
      // En production, utilisez PostGIS ou une extension géospatiale
      const { data: localisations, error } = await supabase
        .from('localisation')
        .select('*');

      if (error) {
        throw error;
      }

      // Filtrer les localisations dans le rayon
      const nearbyLocalisations = localisations?.filter(loc => {
        const distance = Math.sqrt(
          Math.pow(loc.latitude - lat, 2) + Math.pow(loc.longitude - lng, 2)
        ) * 111; // Approximation: 1 degré ≈ 111 km
        return distance <= radius;
      }) || [];

      res.json({ success: true, data: nearbyLocalisations });
    } catch (error) {
      console.error('Error fetching nearby localisations:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch nearby localisations' 
      });
    }
  }
} 