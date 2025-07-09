import { Request, Response } from 'express';
import { userService, User } from '../services/supabase.service';
import { LogService, HttpLog } from '../services/log.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface NotificationResponse {
  id: string;
  [key: string]: any;
}

// Fonction pour envoyer un email de bienvenue
async function sendWelcomeEmail(userEmail: string, username: string, userId: number) {
  try {
    const notificationData = {
      title: "Bienvenue sur ClimbHelp ! 🧗‍♂️",
      message: `Félicitations ${username} ! Votre compte ClimbHelp a été créé avec succès. Vous pouvez maintenant accéder à toutes nos fonctionnalités pour améliorer votre escalade.`,
      userId: userId.toString(),
      userEmail: userEmail,
      userName: username,
      sendEmail: true
    };

    const response = await fetch('http://localhost:3005/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      const errorMessage = `Failed to send welcome email: ${response.statusText}`;
      console.error(errorMessage);
      
      // Logger l'erreur dans la table http_logs existante
      const emailLog: HttpLog = {
        method: 'EMAIL',
        url: 'http://localhost:3005/api/notifications',
        status_code: response.status,
        response_time_ms: 0,
        user_id: userId,
        ip_address: 'internal',
        error_message: errorMessage,
        log_type: 'email',
        email_type: 'welcome_email',
        user_email: userEmail
      };
      LogService.insertHttpLogAsync(emailLog);
    } else {
      const responseData = await response.json() as NotificationResponse;
      console.log('Welcome email sent successfully to:', userEmail);
      
      // Logger le succès dans la table http_logs existante
      const emailLog: HttpLog = {
        method: 'EMAIL',
        url: 'http://localhost:3005/api/notifications',
        status_code: response.status,
        response_time_ms: 0,
        user_id: userId,
        ip_address: 'internal',
        log_type: 'email',
        email_type: 'welcome_email',
        user_email: userEmail,
        notification_id: responseData.id
      };
      LogService.insertHttpLogAsync(emailLog);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error sending welcome email:', error);
    
    // Logger l'erreur dans la table http_logs existante
    const emailLog: HttpLog = {
      method: 'EMAIL',
      url: 'http://localhost:3005/api/notifications',
      status_code: 500,
      response_time_ms: 0,
      user_id: userId,
      ip_address: 'internal',
      error_message: errorMessage,
      log_type: 'email',
      email_type: 'welcome_email',
      user_email: userEmail
    };
    LogService.insertHttpLogAsync(emailLog);
  }
}

export class UserController {
  // GET /api/users
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAll();
      res.json({ success: true, data: users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch users' 
      });
    }
  }

  // GET /api/users/:id
  static async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid user ID' 
        });
      }

      const user = await userService.getById(id);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      // Inclure le champ premium dans la réponse
      res.json({ success: true, data: { ...user, premium: user.premium } });
      return;

    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch user' 
      });
    }
  }

  // POST /api/users
  static async createUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      // Validation
      if (!username || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Username, email and password are required' 
        });
      }

      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const userData: Partial<User> = {
        username,
        email,
        password_hash
      };

      const newUser = await userService.create(userData);
      
      // Envoyer l'email de bienvenue
      if (newUser && newUser.id) {
        await sendWelcomeEmail(email, username, newUser.id);
      }
      
      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create user' 
      });
    }
  }

  // PUT /api/users/:id
  static async updateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid user ID' 
        });
      }

      const updateData: Partial<User> = { ...req.body };
      // Si on veut changer le mot de passe, il faut le hasher
      if (updateData.password) {
        const saltRounds = 10;
        updateData.password_hash = await bcrypt.hash(updateData.password, saltRounds);
        delete updateData.password;
      }

      const updatedUser = await userService.update(id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      res.json({ success: true, data: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update user' 
      });
    }
  }

  // DELETE /api/users/:id
  static async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid user ID' 
        });
      }

      await userService.delete(id);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete user' 
      });
    }
  }

  // GET /api/users/search?field=value
  static async searchUsers(req: Request, res: Response) {
    try {
      const filters = req.query;
      const users = await userService.query(filters);
      res.json({ success: true, data: users });
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to search users' 
      });
    }
  }

  // POST /api/users/login
  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email and password are required' 
        });
      }

      // Rechercher l'utilisateur par email
      const users = await userService.query({ email });
      
      if (!users || users.length === 0) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid email or password' 
        });
      }

      const user = users[0];

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid email or password' 
        });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          username: user.username 
        },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '24h' }
      );

      // Retourner les informations utilisateur (sans le mot de passe) et le token
      const { password_hash, ...userWithoutPassword } = user;
      
      res.json({ 
        success: true, 
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to login' 
      });
    }
  }
} 