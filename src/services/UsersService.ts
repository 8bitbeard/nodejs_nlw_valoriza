import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { classToPlain } from "class-transformer";
import { hash } from "bcryptjs";

interface IUserRequest {
  name: string;
  email: string;
  admin?: boolean;
  password: string;
  }

interface IUserEdit {
  id: string;
  name?: string;
  email?: string;
  admin?: boolean
  }

interface IUserPassword {
  id: string,
  password: string
}

interface ISearchUser {
  name?: string,
  email?: string
}
class UsersService {
  async create({name, email, admin = false, password} : IUserRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    if(!email) {
      throw new Error("Email incorrect");
    }

    const userAlreadyExists = await usersRepositories.findOne({
      email
    });

    if(userAlreadyExists) {
      throw new Error("User already exists");
    }

    const isNum = /^\d+$/.test(password);

    if(!isNum) {
      throw new Error("Password must contain only numbers!")
    }

    if(password.length != 4) {
      throw new Error("Password size must be equal to 4!")
    }

    const passwordHash = await hash(password, 8)

    const user = usersRepositories.create({
      name,
      email,
      admin,
      password: passwordHash,
    });

    await usersRepositories.save(user);

    return user;
  }

  async index({name, email}: ISearchUser) {
      const usersRepositories = getCustomRepository(UsersRepositories);

      const userData: ISearchUser = new Object();

      if(name) { userData.name = name }
      if(email) { userData.email = email }

      const users = await usersRepositories.find(userData);

      return classToPlain(users);
  }

  async search(id: string) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const user = await usersRepositories.findOne(id);
    if(!user) {
      throw new Error('User not found!')
    }
    return classToPlain(user);
  }

  async edit({id, name, email, admin}: IUserEdit) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const currentUserData = await usersRepositories.findOne({
      id
    });

    if(!currentUserData) {
        throw new Error("User don't exist!")
    }

    if(( name === currentUserData.name && email === currentUserData.email && admin === currentUserData.admin ) || (!name && !email && !admin)) {
      throw new Error('No changes were made!')
    }

    const newUserData: IUserEdit = {
        id: currentUserData.id,
        name: name || currentUserData.name,
        email: email || currentUserData.email,
        admin: admin || currentUserData.admin
    }

    await usersRepositories.save(newUserData);
  }

  async remove(admin_id: string, user_id: string) {
    const usersRepositories = getCustomRepository(UsersRepositories);
    const userExists = await usersRepositories.findOne({
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

  async update({id, password}: IUserPassword) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const currentUserData = await usersRepositories.findOne({
      id
    })

    if(!currentUserData) {
      throw new Error("User does not exists!")
    }

    const isNum = /^\d+$/.test(password);

    if(!isNum) {
      throw new Error("Password must contain only numbers!")
    }

    if(password.length != 4) {
      throw new Error("Password size must be equal to 4!")
    }

    const passwordHash = await hash(password, 8)

    await usersRepositories.save({
      id,
      password: passwordHash
    });
  }
}

export { UsersService }
