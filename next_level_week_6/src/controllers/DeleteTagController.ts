import { Request, Response } from "express";
import { DeleteTagService } from "../services/DeleteTagService";

class DeleteTagController {

    async handle(request: Request, response: Response) {
        const deleteTagSevice = new DeleteTagService()

        const { id } = request.params;

        const tag = await deleteTagSevice.execute(id);

        return response.json(tag)
    }

}

export { DeleteTagController }