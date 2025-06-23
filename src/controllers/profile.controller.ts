import { Request, Response } from 'express';
import { profileService, Profile } from '../services/supabase.service';
import { supabase } from '../config/supabase';

export class ProfileController {
  // GET /api/profiles
  static async getAllProfiles(req: Request, res: Response) {
    try {
      const profiles = await profileService.getAll();
      res.json({ success: true, data: profiles });
    } catch (error) {
      console.error('Error fetching profiles:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch profiles' 
      });
    }
  }

  // GET /api/profiles/:id
  static async getProfileById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid profile ID' 
        });
      }

      const profile = await profileService.getById(id);
      if (!profile) {
        return res.status(404).json({ 
          success: false, 
          error: 'Profile not found' 
        });
      }

      res.json({ success: true, data: profile });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch profile' 
      });
    }
  }

  // GET /api/profiles/user/:userId
  static async getProfileByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid user ID' 
        });
      }

      const profiles = await profileService.query({ user_id: userId });
      if (profiles.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Profile not found for this user' 
        });
      }

      res.json({ success: true, data: profiles[0] });
    } catch (error) {
      console.error('Error fetching profile by user ID:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch profile by user ID' 
      });
    }
  }

  // GET /api/profiles/user/:userId/complete
  static async getUserWithProfile(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid user ID' 
        });
      }

      // Récupérer l'utilisateur avec son profil
      const { data: user, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          profiles (*)
        `)
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Error fetching user with profile:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch user with profile' 
      });
    }
  }

  // POST /api/profiles
  static async createProfile(req: Request, res: Response) {
    try {
      const { user_id, first_name, last_name, bio, avatar_url } = req.body;

      // Validation
      if (!user_id) {
        return res.status(400).json({ 
          success: false, 
          error: 'User ID is required' 
        });
      }

      const profileData: Partial<Profile> = {
        user_id,
        first_name,
        last_name,
        bio,
        avatar_url
      };

      const newProfile = await profileService.create(profileData);
      res.status(201).json({ success: true, data: newProfile });
    } catch (error) {
      console.error('Error creating profile:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create profile' 
      });
    }
  }

  // PUT /api/profiles/:id
  static async updateProfile(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid profile ID' 
        });
      }

      const { first_name, last_name, bio, avatar_url } = req.body;
      const updateData: Partial<Profile> = {};

      if (first_name !== undefined) updateData.first_name = first_name;
      if (last_name !== undefined) updateData.last_name = last_name;
      if (bio !== undefined) updateData.bio = bio;
      if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

      const updatedProfile = await profileService.update(id, updateData);
      if (!updatedProfile) {
        return res.status(404).json({ 
          success: false, 
          error: 'Profile not found' 
        });
      }

      res.json({ success: true, data: updatedProfile });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update profile' 
      });
    }
  }

  // DELETE /api/profiles/:id
  static async deleteProfile(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid profile ID' 
        });
      }

      await profileService.delete(id);
      res.json({ success: true, message: 'Profile deleted successfully' });
    } catch (error) {
      console.error('Error deleting profile:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete profile' 
      });
    }
  }

  // GET /api/profiles/search?field=value
  static async searchProfiles(req: Request, res: Response) {
    try {
      const filters = req.query;
      const profiles = await profileService.query(filters);
      res.json({ success: true, data: profiles });
    } catch (error) {
      console.error('Error searching profiles:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to search profiles' 
      });
    }
  }
} 