import { Request, Response } from "express";
import { UsersService } from "../services/UsersService";

class UsersController {

    async create(request: Request, response: Response) {
        const usersService = new UsersService();

        const { name, email, admin, password } = request.body;

        const user = await usersService.create({name, email, admin, password});

        return response.status(201).json(user);
    }

    async index(request: Request, response: Response) {
        const usersService = new UsersService();

        const users = await usersService.index();

        return response.json(users);
    }

    async search(request: Request, response: Response) {
        const usersService = new UsersService();
        const { id } = request.params;

        const user = await usersService.search(id);

        return response.status(200).json(user);
    }

    async edit(request: Request, response: Response) {
        const usersService = new UsersService();

        const { id, name, email, admin } = request.body;

        const user = await usersService.edit({id, name, email, admin});

        return response.status(200).json(user);
    }

    async remove(request: Request, response: Response) {
        const usersService = new UsersService();

        const { id } = request.params;

        const user_id = request.user_id;

        const user = await usersService.remove(user_id, id)

        return response.status(204).json(user);
    }

    async update(request: Request, response: Response) {
        const usersService = new UsersService();

        const { password } = request.body;
        const id = request.user_id;

        const user = usersService.update({id, password});

        return response.status(200).json(user)
    }
}

export { UsersController }