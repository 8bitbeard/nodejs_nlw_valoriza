import { Request, Response } from "express";
import { DeleteUserService } from "../services/DeleteUserService";

class DeleteUserController {

  async handle(request: Request, response: Response) {

    const deleteUserService = new DeleteUserService()

    const { id } = request.params;
    const user_id = request.user_id;

    const user = await deleteUserService.execute(user_id, id)

    return response.json(user);

  }

}

export { DeleteUserController }