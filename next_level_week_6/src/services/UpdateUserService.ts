import { getCustomRepository } from "typeorm"
import { UsersRepositories } from "../repositories/UsersRepositories";

interface IUserEdit {
  id: string;
  name: string;
  email: string;
  admin: boolean
}

class UpdateUserService {

  async execute({id, name, email, admin}: IUserEdit) {
    const userRepositories = getCustomRepository(UsersRepositories);

    const currentUserData = await userRepositories.findOne({
      id
    });

    if(!currentUserData) {
      throw new Error("User don't exist!")
    }

    const newUserData: IUserEdit = {
      ...currentUserData,
      name: name || currentUserData.name,
      email: email || currentUserData.email,
      admin: admin || currentUserData.admin
    }

    const update = await userRepositories.update({ id }, newUserData);

    return update
  }

}

export { UpdateUserService }