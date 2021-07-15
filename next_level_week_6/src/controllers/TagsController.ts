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

    return response.status(200).json(tags);
  }

  async update(request: Request, response: Response) {
    const { id, name } = request.body;
    const tagsService = new TagsService();

    await tagsService.update(id, name);

    return response.status(204).json();
  }

  async remove(request: Request, response: Response) {
    const { id } = request.params
    const tagsService = new TagsService();

    await tagsService.remove(id);

    return response.status(204).json();
  }
}

export { TagsController }
