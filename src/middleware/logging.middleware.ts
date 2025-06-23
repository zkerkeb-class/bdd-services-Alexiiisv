import morgan from 'morgan';
import { Request, Response } from 'express';
import { LogService, HttpLog } from '../services/log.service';

// Fonction pour extraire l'IP réelle (gère les proxies)
function getClientIp(req: Request): string {
  return req.headers['x-forwarded-for'] as string || 
         req.headers['x-real-ip'] as string || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         'unknown';
}

// Fonction pour extraire l'user_id depuis la requête (si disponible)
function getUserId(req: Request): number | undefined {
  // Si tu utilises JWT ou session, tu peux extraire l'user_id ici
  // Exemple avec JWT: return req.user?.id;
  // Exemple avec session: return req.session?.userId;
  return undefined; // À adapter selon ton système d'auth
}

// Middleware de logging personnalisé
export const loggingMiddleware = morgan((tokens, req: Request, res: Response) => {
  // Récupération des informations de base
  const method = tokens.method(req, res) || 'unknown';
  const url = tokens.url(req, res) || 'unknown';
  const status = parseInt(tokens.status(req, res) || '0');
  const responseTime = parseFloat(tokens['response-time'](req, res) || '0');
  const contentLength = parseInt(tokens.res(req, res, 'content-length') || '0');
  
  // Récupération des informations supplémentaires
  const ipAddress = getClientIp(req);
  const userAgent = req.headers['user-agent'];
  const referrer = req.headers.referer || req.headers.referrer;
  const userId = getUserId(req);
  
  // Création de l'objet log
  const logData: HttpLog = {
    method,
    url,
    status_code: status,
    response_time_ms: responseTime,
    content_length: contentLength || undefined,
    user_id: userId,
    ip_address: ipAddress,
    user_agent: userAgent || undefined,
    referrer: referrer as string || undefined,
    error_message: status >= 400 ? `HTTP ${status}` : undefined
  };

  // Insertion asynchrone dans Supabase (ne bloque pas la réponse)
  LogService.insertHttpLogAsync(logData);

  // Retourne le format standard de Morgan pour l'affichage console
  return [
    method,
    url,
    status,
    responseTime + 'ms',
    contentLength + 'b'
  ].join(' ');
}); 