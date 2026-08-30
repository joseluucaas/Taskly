import { Request, Response, NextFunction } from 'express';

import { AuthService } from '../services/auth.service.js';

import {
  registerSchema,
  loginSchema,
} from '../schemas/auth.schema.js';

import {
  refreshTokenSchema,
} from '../schemas/refreshToken.schema.js';

import {
  successResponse,
} from '../utils/apiResponse.js';



const authService = new AuthService();



export class AuthController {


  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {

      const data = registerSchema.parse(
        req.body,
      );


      const user =
        await authService.register(
          data.name,
          data.email,
          data.password,
        );



      return res.status(201).json(
        successResponse(user),
      );


    } catch (error) {

      return next(error);

    }
  }





  async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {

      const data = loginSchema.parse(
        req.body,
      );



      const result =
        await authService.login(
          data.email,
          data.password,
        );



      return res.status(200).json(
        successResponse(result),
      );


    } catch (error) {

      return next(error);

    }
  }





  async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {

      const data =
        refreshTokenSchema.parse(
          req.body,
        );



      const result =
        await authService.refresh(
          data.refreshToken,
        );



      return res.status(200).json(
        successResponse(result),
      );


    } catch (error) {

      return next(error);

    }
  }





  async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {

      const data =
        refreshTokenSchema.parse(
          req.body,
        );



      await authService.logout(
        data.refreshToken,
      );



      return res.status(200).json(
        successResponse({
          message: 'Logout realizado com sucesso',
        }),
      );


    } catch (error) {

      return next(error);

    }
  }

}