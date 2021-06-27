import { Request, Response } from "express";
import { UpdateUserService } from "../services/UpdateUserService";

class UpdateUserController {

  async handle(request: Request, response: Response) {
    const { id, name, email, admin } = request.body;

    const updateUserService = new UpdateUserService();

    const user = await updateUserService.execute({id, name, email, admin});

    return response.status(200).json(user);

  }
}

export { UpdateUserController }