import { getCustomRepository } from "typeorm"
import { TagsRepositories } from "../repositories/TagsRepositories"

class DeleteTagService {

    async execute(id: string) {
        const tagRepositories = getCustomRepository(TagsRepositories);

        const tag = tagRepositories.findOne({
            id
        })

        if(!tag) {
            throw new Error("Tag does not exist!");
        }

        return tag
    }

}

export { DeleteTagService }