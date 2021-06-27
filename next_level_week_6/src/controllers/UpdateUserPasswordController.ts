import { Request, Response } from "express";
import { UpdateUserPasswordService } from "../services/UpdateUserPassowordService";

class UpdateUserPasswordController {

  async handle(request: Request, response: Response) {

    const updateUserPasswordService = new UpdateUserPasswordService();

    const { password } = request.body;
    const id = request.user_id;

    const user = updateUserPasswordService.execute({id, password});

    return response.status(200).json(user)
  }

}

export { UpdateUserPasswordController }