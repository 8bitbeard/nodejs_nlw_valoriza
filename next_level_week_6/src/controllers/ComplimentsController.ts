import { Request, Response } from "express";
import { ComplimentsService } from "../services/ComplimentsService";

class ComplimentsController {

    async search(request: Request, response: Response) {
        const complimentsService = new ComplimentsService();

        const compliments = await complimentsService.search()

        return response.json(compliments)
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

    async remove(request: Request, response: Response) {
        const complimentsService = new ComplimentsService();
        const { id } = request.params;
        const { user_id } = request;

        const compliment = await complimentsService.remove(user_id, id)

        return response.status(204).json(compliment);
    }

}

export { ComplimentsController }