import { Request, Response } from "express";
import { DeleteComplimentService } from "../services/DeleteComplimentService";

class DeleteComplimentController {
  async handle(request: Request, response: Response) {
    const deleteComplimentService = new DeleteComplimentService();

    const { id } = request.params;

    const compliment = await deleteComplimentService.execute(id)

    return response.json(compliment)

  }

}

export { DeleteComplimentController }