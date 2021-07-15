import { Request, Response } from "express";
import { ComplimentsService } from "../services/ComplimentsService";

class ComplimentsController {

    async searchBySender(request: Request, response: Response) {
        const complimentsService = new ComplimentsService();
        const user_id = request.user_id;

        const compliments = await complimentsService.searchBySender(user_id)

        return response.status(200).json(compliments)
    }

    async searchByReceiver(request: Request, response: Response) {
      const complimentsService = new ComplimentsService();
      const user_id = request.user_id;

      const compliments = await complimentsService.searchByReceiver(user_id)

      return response.status(200).json(compliments)
  }

    async create(request: Request, response: Response) {
        const complimentsService = new ComplimentsService();
        const { tag_id, user_receiver, message } = request.body;
        const { user_id } = request;

        const compliment = await complimentsService.create({
            tag_id,
            user_sender: user_id,
            user_receiver,
            message
        })

        return response.status(201).json(compliment);
    }

    async updateMessage(request: Request, response: Response) {
      const complimentsService = new ComplimentsService();
      const { id } = request.params;
      const { message } = request.body;
      const { user_id } = request;

      await complimentsService.updateMessage(user_id, id, message);

      return response.status(204).json();
    }

    async remove(request: Request, response: Response) {
        const complimentsService = new ComplimentsService();
        const { id } = request.params;
        const { user_id } = request;

        await complimentsService.remove(user_id, id)

        return response.status(204).json();
    }
}

export { ComplimentsController }