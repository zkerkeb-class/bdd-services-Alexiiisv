import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export class ChatConversationController {
  // Récupérer toutes les conversations (avec pagination)
  static async getAllConversations(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { data, error, count } = await supabase
        .from('chat_conversations')
        .select('*, users(username, email)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + Number(limit) - 1);

      if (error) throw error;

      res.json({
        conversations: data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          totalPages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }

  // Récupérer les conversations d'un utilisateur spécifique
  static async getConversationsByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { data, error, count } = await supabase
        .from('chat_conversations')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + Number(limit) - 1);

      if (error) throw error;

      res.json({
        conversations: data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          totalPages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching user conversations:', error);
      res.status(500).json({ error: 'Failed to fetch user conversations' });
    }
  }

  // Récupérer une conversation par son ID
  static async getConversationById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*, users(username, email)')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      res.json(data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ error: 'Failed to fetch conversation' });
    }
  }

  // Récupérer les conversations par conversation_uid (session de conversation)
  static async getConversationsByUid(req: Request, res: Response) {
    try {
      const { conversationUid } = req.params;

      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*, users(username, email)')
        .eq('conversation_uid', conversationUid)
        .order('created_at', { ascending: true });

      if (error) throw error;

      res.json(data);
    } catch (error) {
      console.error('Error fetching conversation session:', error);
      res.status(500).json({ error: 'Failed to fetch conversation session' });
    }
  }

  // Créer une nouvelle conversation
  static async createConversation(req: Request, res: Response) {
    try {
      const { user_id, message, response, conversation_uid } = req.body;

      if (!user_id || !message || !response) {
        return res.status(400).json({ 
          error: 'user_id, message, and response are required' 
        });
      }

      const conversationData = {
        user_id,
        message,
        response,
        conversation_uid: conversation_uid || undefined // Si non fourni, la DB génère automatiquement
      };

      const { data, error } = await supabase
        .from('chat_conversations')
        .insert(conversationData)
        .select('*, users(username, email)')
        .single();

      if (error) throw error;

      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ error: 'Failed to create conversation' });
    }
  }

  // Mettre à jour une conversation
  static async updateConversation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { message, response } = req.body;

      if (!message && !response) {
        return res.status(400).json({ 
          error: 'At least message or response must be provided' 
        });
      }

      const updateData: any = {};
      if (message) updateData.message = message;
      if (response) updateData.response = response;

      const { data, error } = await supabase
        .from('chat_conversations')
        .update(updateData)
        .eq('id', id)
        .select('*, users(username, email)')
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      res.json(data);
    } catch (error) {
      console.error('Error updating conversation:', error);
      res.status(500).json({ error: 'Failed to update conversation' });
    }
  }

  // Supprimer une conversation
  static async deleteConversation(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      res.status(500).json({ error: 'Failed to delete conversation' });
    }
  }

  // Supprimer toutes les conversations d'un utilisateur
  static async deleteUserConversations(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      res.json({ message: 'All user conversations deleted successfully' });
    } catch (error) {
      console.error('Error deleting user conversations:', error);
      res.status(500).json({ error: 'Failed to delete user conversations' });
    }
  }

  // Rechercher des conversations
  static async searchConversations(req: Request, res: Response) {
    try {
      const { q, userId, conversationUid, page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = supabase
        .from('chat_conversations')
        .select('*, users(username, email)', { count: 'exact' });

      // Filtres
      if (userId) {
        query = query.eq('user_id', userId);
      }
      if (conversationUid) {
        query = query.eq('conversation_uid', conversationUid);
      }
      if (q) {
        query = query.or(`message.ilike.%${q}%,response.ilike.%${q}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + Number(limit) - 1);

      if (error) throw error;

      res.json({
        conversations: data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          totalPages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error searching conversations:', error);
      res.status(500).json({ error: 'Failed to search conversations' });
    }
  }

  // Obtenir les statistiques des conversations d'un utilisateur
  static async getUserConversationStats(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      // Compter le nombre total de conversations
      const { count: totalConversations, error: countError } = await supabase
        .from('chat_conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) throw countError;

      // Compter le nombre de sessions de conversation uniques
      const { count: uniqueSessions, error: sessionsError } = await supabase
        .from('chat_conversations')
        .select('conversation_uid', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (sessionsError) throw sessionsError;

      // Obtenir la première et dernière conversation
      const { data: firstConversation, error: firstError } = await supabase
        .from('chat_conversations')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (firstError && firstError.code !== 'PGRST116') throw firstError;

      const { data: lastConversation, error: lastError } = await supabase
        .from('chat_conversations')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (lastError && lastError.code !== 'PGRST116') throw lastError;

      res.json({
        totalConversations: totalConversations || 0,
        uniqueSessions: uniqueSessions || 0,
        firstConversation: firstConversation?.created_at || null,
        lastConversation: lastConversation?.created_at || null
      });
    } catch (error) {
      console.error('Error fetching user conversation stats:', error);
      res.status(500).json({ error: 'Failed to fetch user conversation stats' });
    }
  }
} 