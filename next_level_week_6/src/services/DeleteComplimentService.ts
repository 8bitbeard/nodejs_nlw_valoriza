import { getCustomRepository } from "typeorm"
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories"


class DeleteComplimentService {

  async execute(compliment_id: string) {
    const complimentsRepositories = getCustomRepository(ComplimentsRepositories);

    const complimentExists = await complimentsRepositories.findOne({
      id: compliment_id
    })

    if(!complimentExists) {
      throw new Error("Compliment does not exists!")
    }

    const compliment = await complimentsRepositories.delete({
      id: compliment_id
    })

    return compliment
  }

}

export { DeleteComplimentService }