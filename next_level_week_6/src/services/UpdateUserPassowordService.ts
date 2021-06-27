import { getCustomRepository } from "typeorm"
import { UsersRepositories } from "../repositories/UsersRepositories";
import { hash } from "bcryptjs";

interface IUserPassword {
  id: string,
  password: string
}

class UpdateUserPasswordService {

  async execute({id, password}: IUserPassword) {

    const usersRepositories = getCustomRepository(UsersRepositories);

    const currentUserData = await usersRepositories.findOne({
      id
    })

    if(!currentUserData) {
      throw new Error("User does not exists!")
    }

    const passwordHash = await hash(password, 8)

    const newUserData = {
      ...currentUserData,
      password: passwordHash
    }

    const update = await usersRepositories.update({ id }, newUserData);

    return update

  }

}

export { UpdateUserPasswordService }