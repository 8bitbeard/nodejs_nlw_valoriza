import { Request, Response } from "express";
import { ListComplimentsService } from "../services/ListComplimentsService";

class ListComplimentsController {

    async handle(request: Request, response: Response) {
        const listComplimentsService = new ListComplimentsService()
    }

}

export { ListComplimentsController }