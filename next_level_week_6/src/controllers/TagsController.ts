import { Request, Response } from "express";
import { TagsService } from "../services/TagsService";

class TagsController {

    async create(request: Request, response: Response) {
        const { name } = request.body

        const tagsService = new TagsService();

        const tag = await tagsService.create(name);

        return response.status(201).json(tag)
    }

    async search(request: Request, response: Response) {
        const tagsService = new TagsService();

        const tags = await tagsService.search();

        return response.json(tags);
    }

    async remove(request: Request, response: Response) {
        return response.status(200).json({"message": "ok"})
    }

}

export { TagsController }