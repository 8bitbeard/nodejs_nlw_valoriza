import { getCustomRepository } from "typeorm"
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories"

class ComplimentsService {

    async search() {
        const complimentsRepositories = getCustomRepository(ComplimentsRepositories)

    }

    async create() {
        const complimentsRepositories = getCustomRepository(ComplimentsRepositories)

    }

    async remove() {
        const complimentsRepositories = getCustomRepository(ComplimentsRepositories)

    }

}

export { ComplimentsService }