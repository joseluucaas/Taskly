import { Request, Response } from 'express';

import { AuthService } from '../services/auth.service.js';

import {
  registerSchema,
  loginSchema,
} from '../schemas/auth.schema.js';


const authService = new AuthService();


export class AuthController {
  async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);

    const user = await authService.register(
      data.name,
      data.email,
      data.password,
    );

    return res.status(201).json(user);
  }


  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);

    const result = await authService.login(
      data.email,
      data.password,
    );

    return res.status(200).json(result);
  }
}