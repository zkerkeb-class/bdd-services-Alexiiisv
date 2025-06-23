import { supabase } from '../config/supabase';

export interface HttpLog {
  method: string;
  url: string;
  status_code: number;
  response_time_ms: number;
  content_length?: number;
  user_id?: number;
  ip_address: string;
  user_agent?: string | undefined;
  referrer?: string | undefined;
  error_message?: string;
}

export class LogService {
  static async insertHttpLog(logData: HttpLog): Promise<void> {
    try {
      const { error } = await supabase
        .from('http_logs')
        .insert([logData]);

      if (error) {
        console.error('Error inserting log into Supabase:', error);
      }
    } catch (error) {
      console.error('Error in LogService.insertHttpLog:', error);
    }
  }

  static async insertHttpLogAsync(logData: HttpLog): Promise<void> {
    // Version asynchrone qui ne bloque pas la réponse
    setImmediate(() => {
      this.insertHttpLog(logData);
    });
  }
} 