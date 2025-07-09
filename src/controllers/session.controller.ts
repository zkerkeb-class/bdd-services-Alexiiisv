import { Request, Response } from 'express';
import { sessionService, Session } from '../services/supabase.service';
import { supabase } from '../config/supabase';
import crypto from 'crypto';

export class SessionController {
  // GET /api/sessions
  static async getAllSessions(req: Request, res: Response) {
    try {
      const sessions = await sessionService.getAll();
      res.json({ success: true, data: sessions });
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch sessions' 
      });
    }
  }

  // GET /api/sessions/:id
  static async getSessionById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid session ID' 
        });
      }

      const session = await sessionService.getById(id);
      if (!session) {
        return res.status(404).json({ 
          success: false, 
          error: 'Session not found' 
        });
      }

      res.json({ success: true, data: session });
    } catch (error) {
      console.error('Error fetching session:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch session' 
      });
    }
  }

  // GET /api/sessions/user/:userId
  static async getSessionsByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid user ID' 
        });
      }

      const sessions = await sessionService.query({ user_id: userId });
      res.json({ success: true, data: sessions });
    } catch (error) {
      console.error('Error fetching sessions by user ID:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch sessions by user ID' 
      });
    }
  }

  // GET /api/sessions/active
  static async getActiveSessions(req: Request, res: Response) {
    try {
      const now = new Date().toISOString();
      const { data: sessions, error } = await supabase
        .from('sessions')
        .select('*')
        .gt('expires_at', now);

      if (error) {
        throw error;
      }

      res.json({ success: true, data: sessions || [] });
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch active sessions' 
      });
    }
  }

  // POST /api/sessions
  static async createSession(req: Request, res: Response) {
    try {
      const { 
        user_id, 
        expires_at, 
        device_type, 
        browser, 
        os, 
        ip_address, 
        location, 
        is_mobile 
      } = req.body;

      // Validation
      if (!user_id || !expires_at) {
        return res.status(400).json({ 
          success: false, 
          error: 'User ID and expiration date are required' 
        });
      }

      // Générer un token unique
      const token = crypto.randomBytes(32).toString('hex');

      const sessionData: Partial<Session> = {
        user_id,
        token,
        expires_at,
        device_type,
        browser,
        os,
        ip_address,
        location,
        is_mobile,
        last_activity: new Date().toISOString()
      };

      const newSession = await sessionService.create(sessionData);
      res.status(201).json({ success: true, data: newSession });
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create session' 
      });
    }
  }

  // PUT /api/sessions/:id
  static async updateSession(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid session ID' 
        });
      }

      const { 
        expires_at, 
        device_type, 
        browser, 
        os, 
        ip_address, 
        location, 
        is_mobile 
      } = req.body;
      const updateData: Partial<Session> = {};

      if (expires_at !== undefined) updateData.expires_at = expires_at;
      if (device_type !== undefined) updateData.device_type = device_type;
      if (browser !== undefined) updateData.browser = browser;
      if (os !== undefined) updateData.os = os;
      if (ip_address !== undefined) updateData.ip_address = ip_address;
      if (location !== undefined) updateData.location = location;
      if (is_mobile !== undefined) updateData.is_mobile = is_mobile;
      
      // Mettre à jour l'activité
      updateData.last_activity = new Date().toISOString();

      const updatedSession = await sessionService.update(id, updateData);
      if (!updatedSession) {
        return res.status(404).json({ 
          success: false, 
          error: 'Session not found' 
        });
      }

      res.json({ success: true, data: updatedSession });
    } catch (error) {
      console.error('Error updating session:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update session' 
      });
    }
  }

  // DELETE /api/sessions/:id
  static async deleteSession(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid session ID' 
        });
      }

      await sessionService.delete(id);
      res.json({ success: true, message: 'Session deleted successfully' });
    } catch (error) {
      console.error('Error deleting session:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete session' 
      });
    }
  }

  // DELETE /api/sessions/user/:userId
  static async deleteAllUserSessions(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid user ID' 
        });
      }

      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      res.json({ success: true, message: 'All user sessions deleted successfully' });
    } catch (error) {
      console.error('Error deleting all user sessions:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete all user sessions' 
      });
    }
  }

  // POST /api/sessions/validate
  static async validateSession(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ 
          success: false, 
          error: 'Token is required' 
        });
      }

      const { data: session, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('token', token)
        .single();

      if (error || !session) {
        return res.status(404).json({ 
          success: false, 
          error: 'Session not found' 
        });
      }

      // Vérifier si la session n'est pas expirée
      const now = new Date();
      const expiresAt = new Date(session.expires_at);
      
      if (now > expiresAt) {
        return res.status(401).json({ 
          success: false, 
          error: 'Session expired' 
        });
      }

      // Mettre à jour l'activité
      await sessionService.update(session.id, {
        last_activity: now.toISOString()
      });

      res.json({ success: true, data: session });
    } catch (error) {
      console.error('Error validating session:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to validate session' 
      });
    }
  }

  // GET /api/sessions/search?field=value
  static async searchSessions(req: Request, res: Response) {
    try {
      const filters = req.query;
      const sessions = await sessionService.query(filters);
      res.json({ success: true, data: sessions });
    } catch (error) {
      console.error('Error searching sessions:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to search sessions' 
      });
    }
  }
} 