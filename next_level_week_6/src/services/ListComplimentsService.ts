import { getCustomRepository } from "typeorm"
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories"

class ListComplimentsService {

    async execute() {
        const complimentsRepositories = getCustomRepository(ComplimentsRepositories);
        
    }

}

export { ListComplimentsService }