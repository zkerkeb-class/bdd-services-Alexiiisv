import { supabase } from '../config/supabase';

// Types pour les entités
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
  premium: boolean; // <-- Ajouté
  password?: string; // Ajouté pour les requêtes de mise à jour
}

export interface Profile {
  id?: number;
  user_id: number;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Localisation {
  id?: number;
  latitude: number;
  longitude: number;
}

export interface Session {
  id?: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  ip_address?: string;
  last_activity?: string;
  location?: string;
  is_mobile?: boolean;
}

export interface Salle {
  id?: number;
  admin_id?: number;
  localisation?: number;
  description?: string;
  email?: string;
  telephone?: string;
  nom: string;
  created_at?: string;
  updated_at?: string;
}

export interface Voie {
  id?: number;
  salle_id: number;
  cotation?: string;
  description?: string;
  ouvreur?: string;
  nom?: string;
  type_de_voie?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Seance {
  id?: number;
  user_id: number;
  date: string;
  avis?: string;
  salle_id?: number;
}

export interface VoieSeance {
  id?: number;
  seance_id: number;
  voie_id: number;
  reussie?: boolean;
  avis?: string;
}

// Service générique pour les opérations CRUD
export class SupabaseService<T> {
  constructor(private tableName: string) {}

  // CREATE
  async create(data: Partial<T>): Promise<T | null> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      throw error;
    }

    return result;
  }

  // READ - Get all
  async getAll(): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*');

    if (error) {
      console.error(`Error fetching ${this.tableName}:`, error);
      throw error;
    }

    return data || [];
  }

  // READ - Get by ID
  async getById(id: number): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching ${this.tableName} by id:`, error);
      throw error;
    }

    return data;
  }

  // UPDATE
  async update(id: number, data: Partial<T>): Promise<T | null> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      throw error;
    }

    return result;
  }

  // DELETE
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      throw error;
    }
  }

  // Custom query with filters
  async query(filters: Record<string, any>): Promise<T[]> {
    let query = supabase.from(this.tableName).select('*');
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;

    if (error) {
      console.error(`Error querying ${this.tableName}:`, error);
      throw error;
    }

    return data || [];
  }
}

// Service spécifique pour les utilisateurs avec méthode premium
export class UserService extends SupabaseService<User> {
  constructor() {
    super('users');
  }

  async setUserPremium(userId: number) {
    const { data, error } = await supabase
      .from('users')
      .update({ premium: true })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// Services spécifiques pour chaque table
export const userService = new UserService();
export const profileService = new SupabaseService<Profile>('profiles');
export const localisationService = new SupabaseService<Localisation>('localisation');
export const sessionService = new SupabaseService<Session>('sessions');
export const salleService = new SupabaseService<Salle>('salles');
export const voieService = new SupabaseService<Voie>('voies');
export const seanceService = new SupabaseService<Seance>('seances');
export const voieSeanceService = new SupabaseService<VoieSeance>('voie'); 