import { getCustomRepository } from "typeorm"
import { UsersRepositories } from "../repositories/UsersRepositories"

class DeleteUserService {

  async execute(admin_id: string, user_id: string) {
    const usersRepositories = getCustomRepository(UsersRepositories)

    const userExists = usersRepositories.findOne({
      id: user_id
    });

    if(!userExists) {
      throw new Error("User does not exist!");
    }

    if(admin_id === user_id) {
      throw new Error("An user can't delete himself!")
    }

    const user = await usersRepositories.delete({
      id: user_id
    })

    return user
  }

}

export { DeleteUserService }