/*
  Extensão dos tipos do Express para adicionar
  informações do usuário autenticado pelo JWT.
*/
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};