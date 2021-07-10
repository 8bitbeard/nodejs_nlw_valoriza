import { Repository } from "typeorm";
import "typeorm/repository/Repository";
import { getCustomRepository } from "typeorm";
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken";
import { mocked } from 'ts-jest/utils'
import { UsersRepositories } from "../../repositories/UsersRepositories";
import { AuthenticateUserService } from "../../services/AuthenticateUserService";

jest.mock('typeorm', () => ({
  __esModule: true,
  getCustomRepository: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  PrimaryColumn: jest.fn(),
  Column: jest.fn(),
  CreateDateColumn: jest.fn(),
  UpdateDateColumn: jest.fn(),
  Entity: jest.fn(),
  EntityRepository: jest.fn(),
  Repository: jest.fn(),
}));

jest.mock("bcryptjs", () => {
  const compare = async (password: string, userPassword: string) => {
    return (
      new Promise((resolve) => {
        resolve(password === userPassword ? 1 : 0);
      })
    )
  }
  return {
    compare
  }
})

jest.mock("jsonwebtoken", () => {
  const sign = () => {
    return "token-test";
  }

  return {
    sign
  }
})

describe('AuthenticateUsersService', () => {
  const getCustomRepositoryMock = mocked(getCustomRepository);
  const findOneMock = jest.fn();
  const findMock = jest.fn();
  const createMock = jest.fn();
  const saveMock = jest.fn();
  const updateMock = jest.fn();
  const deleteMock = jest.fn();
  let usersRepositories: UsersRepositories

  beforeAll(() => {
    jest.mock("typeorm/repository/Repository");
    Repository.prototype.findOne = findOneMock;
    Repository.prototype.find = findMock;
    Repository.prototype.create = createMock;
    Repository.prototype.save = saveMock;
    Repository.prototype.update = updateMock;
    Repository.prototype.delete = deleteMock;
    usersRepositories = new UsersRepositories();
  })

  beforeEach(async () => {
    jest.resetAllMocks();
    // getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
  });

  it('should return an error when trying to authenticate with inexistent user', async () => {
    const userData = {
      email: 'wilton@example.com',
      password: '1234'
    }
    getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
    const authenticateUserService = new AuthenticateUserService();
    findOneMock.mockReturnValueOnce(null)
    await authenticateUserService.execute(userData).catch(error => {
      expect(error).toBeInstanceOf(Error);
      expect(error).toMatchObject({
        message: 'Email/Password incorrect'
      })
    })
    expect(getCustomRepository).toBeCalledTimes(1);
  });

  it('should return an error when trying to authenticate with wrong password', async () => {
    const userData = {
      email: 'wilton@example.com',
      password: '1234'
    }
    getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
    const authenticateUserService = new AuthenticateUserService();
    findOneMock.mockReturnValueOnce(userData)
    await authenticateUserService.execute({ ...userData, password: '2345' }).catch(error => {
      expect(error).toBeInstanceOf(Error);
      expect(error).toMatchObject({
        message: 'Email/Password incorrect'
      })
    })
    expect(getCustomRepository).toBeCalledTimes(1);
  });

  it('should authenticate with valid credentials', async () => {
    const userData = {
      id: '6775af3c-8a68-41a5-98cb-fc00e6cbe8e2',
      email: 'teste@teste.com',
      password: '1234'
    }
    getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
    const authenticateUserService = new AuthenticateUserService();
    findOneMock.mockReturnValueOnce(userData);
    await authenticateUserService.execute({email: userData.email, password: '1234'})
    expect(getCustomRepository).toBeCalledTimes(1);
    expect(findOneMock).toBeCalledTimes(1);
  })
})
