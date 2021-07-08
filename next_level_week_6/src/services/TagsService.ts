import { getCustomRepository } from "typeorm";
import { TagsRepositories } from "../repositories/TagsRepositories";
import { classToPlain } from "class-transformer";
import { hash } from "bcryptjs";

class TagsService {

    async create(name: string) {
        const tagsRepositories = getCustomRepository(TagsRepositories);

        if (!name) {
          throw new Error("Incorrect name!");
        }

        if (name.length > 50) {
          throw new Error("Tag name must have a maximum size of 50 chars!")
        }

        // SELECT * FROM tags WHERE name = 'name'
        const tagAlreadyExists = await tagsRepositories.findOne({
          name
        });

        if(tagAlreadyExists) {
          throw new Error("Tag already exists!");
        }

        const tag = tagsRepositories.create({
          name
        });

        await tagsRepositories.save(tag);

        return tag;
    }

    async search() {
        const tagsRepositories = getCustomRepository(TagsRepositories);

        const tags = await tagsRepositories.find();

        return classToPlain(tags);
    }
}

export { TagsService }