import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {

  // Receber o Token
  const authToken = request.headers.authorization

  // Validar se o token está preenchido
  if(!authToken) {
    return response.status(401).end();
  }

  const [,token] = authToken.split(" ")

  try {
    // Validar se o token é válido
    const { sub } = verify(token, "59b8a66bd9fc3490b991bdc3cdc2a8bd") as IPayload;

    request.user_id = sub;


    return next();
  } catch(err) {
    return response.status(401).end();
  }





  // Recuperar informações do usuário
}
