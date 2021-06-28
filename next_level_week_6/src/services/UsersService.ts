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
    name: string;
    email: string;
    admin: boolean
  }

interface IUserPassword {
    id: string,
    password: string
}

interface ISearchUser {
    name: string,
    email: string
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

    async index() {
        const usersRepositories = getCustomRepository(UsersRepositories);

        const users = await usersRepositories.find();

        return classToPlain(users);
    }

    async search(id: string) {
      const usersRepositories = getCustomRepository(UsersRepositories);

      const user = await usersRepositories.findOne(id);

      return user;
    }

    async edit({id, name, email, admin}: IUserEdit) {
        const usersRepositories = getCustomRepository(UsersRepositories);

        const currentUserData = await usersRepositories.findOne({
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

            const update = await usersRepositories.update({ id }, newUserData);

            return update
        }

    async remove(admin_id: string, user_id: string) {
        const usersRepositories = getCustomRepository(UsersRepositories);
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

    async update({id, password}: IUserPassword) {
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

export { UsersService }