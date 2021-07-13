import { getCustomRepository } from "typeorm";
import { compare  } from "bcryptjs"
import { sign } from "jsonwebtoken";
import { UsersRepositories } from "../repositories/UsersRepositories";

interface IAuthenticateRequest {
  email: string,
  password: string
}

class AuthenticateUserService {

  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const user = await usersRepositories.findOne({
      email
    });

    if(!user) {
      throw new Error("Email/Password incorrect")
    }

    const passwordMatch = await compare(password, user.password)

    if(!passwordMatch) {
      throw new Error("Email/Password incorrect")
    }

    const token = sign({
      email: user.email
    }, "59b8a66bd9fc3490b991bdc3cdc2a8bd", {
      subject: user.id,
      expiresIn: "1d"
    })

    const tokenResponse = {
      status: 'AUTHENTICATION_SUCCESS',
      access_token: token,
      token_type: 'bearer',
      expires_in: "1d"
    }

    return tokenResponse;
  }
}

export { AuthenticateUserService }
