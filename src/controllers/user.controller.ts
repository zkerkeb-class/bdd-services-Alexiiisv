import { Request, Response } from 'express';
import { userService, User } from '../services/supabase.service';
import bcrypt from 'bcrypt';

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

      res.json({ success: true, data: user });
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

      const { username, email, password } = req.body;
      const updateData: Partial<User> = {};

      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (password) {
        const saltRounds = 10;
        updateData.password_hash = await bcrypt.hash(password, saltRounds);
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
} 