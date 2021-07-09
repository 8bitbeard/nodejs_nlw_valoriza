import { Repository } from "typeorm";
import "typeorm/repository/Repository";
import { getCustomRepository } from "typeorm";
import { mocked } from 'ts-jest/utils'
import { UsersRepositories } from "../../repositories/UsersRepositories";
import { UsersService } from "../../services/UsersService";

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

describe('UsersService', () => {
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

  describe('create', () => {
    it('should return an error when no email is informed', async () => {
      const userData = {
        name: 'teste',
        email: null,
        admin: true,
        password: '1234'
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      // expect(usersService.create('teste', null, true, '1234')).rejects.toBeInstanceOf(Error)
      await usersService.create(userData).catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: 'Email incorrect'
        })
      })
      expect(getCustomRepository).toBeCalledTimes(1);
    })

    it('should return an error when trying to create an already existing user', async() => {
      const userData = {
        name: 'teste',
        email: 'teste@teste,com',
        admin: true,
        password: '1234'
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValueOnce({name: 'test'})
      expect(usersService.create(userData)).rejects.toBeInstanceOf(Error)
      expect(getCustomRepository).toBeCalledTimes(1);
    })

    it('should return an error when trying to create a user with a password containing chars', async () => {
      const userData = {
        name: 'teste',
        email: 'teste@teste,com',
        admin: true,
        password: '123a'
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValueOnce(null);
      expect(usersService.create(userData)).rejects.toBeInstanceOf(Error);
      expect(getCustomRepository).toBeCalledTimes(1);
    })

    it('should return an error when trying to create a user with a password with less than 4 digits', async () => {
      const userData = {
        name: 'teste',
        email: 'teste@teste,com',
        admin: true,
        password: '123'
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValueOnce(null);
      expect(usersService.create(userData)).rejects.toBeInstanceOf(Error);
      expect(getCustomRepository).toBeCalledTimes(1);
    })

    it('should return an error when trying to create a user with a password with more than 4 digits', async () => {
      const userData = {
        name: 'teste',
        email: 'teste@teste,com',
        admin: true,
        password: '12345'
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValueOnce(null);
      expect(usersService.create(userData)).rejects.toBeInstanceOf(Error);
      expect(getCustomRepository).toBeCalledTimes(1);
    })

    it('should create a admin user', async () => {
      const userData = {
        name: 'teste',
        email: 'teste@teste,com',
        admin: true,
        password: '1234'
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(null);
      saveMock.mockReturnValue(true);
      createMock.mockReturnValue({
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton2",
        email: "wilton2@example.com",
        admin: true,
        created_at: "2021-07-06T17:20:34.000Z",
        updated_at: "2021-07-06T17:20:34.000Z"
      })
      await usersService.create(userData)
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(createMock).toBeCalledTimes(1);
      expect(saveMock).toBeCalledTimes(1);
    })

    it('should create a normal user passing the admin parameter', async () => {
      const userData = {
        name: 'teste',
        email: 'teste@teste,com',
        admin: false,
        password: '1234'
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(null);
      saveMock.mockReturnValue(true);
      createMock.mockReturnValue({
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton2",
        email: "wilton2@example.com",
        admin: false,
        created_at: "2021-07-06T17:20:34.000Z",
        updated_at: "2021-07-06T17:20:34.000Z"
      })
      await usersService.create(userData)
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(createMock).toBeCalledTimes(1);
      expect(saveMock).toBeCalledTimes(1);
    })

    it('should create a normal user without passing the admin parameter', async () => {
      const userData = {
        name: 'teste',
        email: 'teste@teste,com',
        password: '1234'
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(null);
      saveMock.mockReturnValue(true);
      createMock.mockReturnValue({
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton2",
        email: "wilton2@example.com",
        created_at: "2021-07-06T17:20:34.000Z",
        updated_at: "2021-07-06T17:20:34.000Z"
      })
      await usersService.create(userData)
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(createMock).toBeCalledTimes(1);
      expect(saveMock).toBeCalledTimes(1);
    })
  })

  describe('index', () => {
    it('should return a list of users searching only by name', async () => {
      getCustomRepositoryMock.mockReturnValue(usersRepositories);
      const usersService = new UsersService();
      findMock.mockReturnValue([{
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
        created_at: "2021-07-06T17:20:34.000Z",
        updated_at: "2021-07-06T17:20:34.000Z"
      }])
      const search = {
        name: 'Wilton',
        email: null
      }
      await usersService.index(search)
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findMock).toBeCalledTimes(1);
    })

    it('should return a list of users searching only by email', async () => {
      getCustomRepositoryMock.mockReturnValue(usersRepositories);
      const usersService = new UsersService();
      findMock.mockReturnValue([{
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
        created_at: "2021-07-06T17:20:34.000Z",
        updated_at: "2021-07-06T17:20:34.000Z"
      }])
      const search = {
        name: null,
        email: 'wilton@example.com'
      }
      await usersService.index(search)
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findMock).toBeCalledTimes(1);
    })

    it('should return a list of users searching with email and name', async () => {
      getCustomRepositoryMock.mockReturnValue(usersRepositories);
      const usersService = new UsersService();
      findMock.mockReturnValue([{
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
        created_at: "2021-07-06T17:20:34.000Z",
        updated_at: "2021-07-06T17:20:34.000Z"
      }])
      const search = {
        name: 'Wilton',
        email: 'wilton@example.com'
      }
      await usersService.index(search)
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findMock).toBeCalledTimes(1);
    })
  })

  describe('search', () => {
    it('should return a valid user', async () => {
      const usersRepositories = new UsersRepositories();
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue({name: 'test'})
      const user = await usersService.search('1');
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(user.name).toBe('test')
    })

    it('should return a error when no users are found', async () => {
      const usersRepositories = new UsersRepositories();
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(null);
      const user = usersService.search('1');
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(user).rejects.toBeInstanceOf(Error)
    })
  })

  describe('edit', () => {
    it('should return an error when the user does not exist', async () => {
      const userData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(null);
      await usersService.edit(userData).catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: "User don't exist!"
        })
      })
      expect(getCustomRepository).toBeCalledTimes(1);
    })

    it('should return an error when trying to edit a user without making any change', async () => {
      const userData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(userData);
      await usersService.edit(userData).catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: "No changes were made!"
        })
      })
      expect(getCustomRepository).toBeCalledTimes(1);
    })

    it('should return an error when trying to edit a user without passing any parameters', async () => {
      const userData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(userData);
      await usersService.edit({id: userData.id}).catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: "No changes were made!"
        })
      })
      expect(getCustomRepository).toBeCalledTimes(1);
    })

    it('should be able to edit the name of an existing user', async () => {
      const userData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(userData);
      await usersService.edit({id: userData.id, name: "Wilton2"})
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(updateMock).toBeCalledTimes(1);
    })

    it('should be able to edit the email of an existing user', async () => {
      const userData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(userData);
      await usersService.edit({id: userData.id, email: "wilton2@example.com"})
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(updateMock).toBeCalledTimes(1);
    })

    it('should be able to edit the admin value of an existing user', async () => {
      const userData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: false,
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(userData);
      await usersService.edit({id: userData.id, admin: true})
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(updateMock).toBeCalledTimes(1);
    })
  })

  describe('remove', () => {
    it('should return an error if the users do not exist', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(null);
      await usersService.remove('1', '2').catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: 'User does not exist!'
        })
      })
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(deleteMock).toBeCalledTimes(0);
    })

    it('should return an error if the user try to remove himself', async () => {
      const userData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(userData);
      await usersService.remove(userData.id, userData.id).catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: "An user can't delete himself!"
        })
      })
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(deleteMock).toBeCalledTimes(0);
    });

    it('should be able to delete a user', async () => {
      const userData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(userData);
      await usersService.remove('1', userData.id);
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(deleteMock).toBeCalledTimes(1);
    })
  })

  describe('update', () => {
    it('should not be able to update the password of a user that do not exists!', async () => {
      const userData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        password: "1234"
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(null);
      await usersService.update(userData).catch(error => {
        expect(error).toBeInstanceOf(Error)
        expect(error).toMatchObject({
          message: "User does not exists!"
        })
      })
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(updateMock).toBeCalledTimes(0);
    })

    it('should not be able to update with a password that contains a character', async () => {
      const userData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
      }
      const passwordData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        password: '123a'
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(userData);
      await usersService.update(passwordData).catch(error => {
        expect(error).toBeInstanceOf(Error)
        expect(error).toMatchObject({
          message: "Password must contain only numbers!"
        })
      })
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(updateMock).toBeCalledTimes(0);
    })

    it('should not be able to update with a password that contains more than 4 digits', async () => {
      const userData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
      }
      const passwordData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        password: '12345'
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(userData);
      await usersService.update(passwordData).catch(error => {
        expect(error).toBeInstanceOf(Error)
        expect(error).toMatchObject({
          message: "Password size must be equal to 4!"
        })
      })
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(updateMock).toBeCalledTimes(0);
    })

    it('should not be able to update with a password that contains less than 4 digits', async () => {
      const userData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
      }
      const passwordData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        password: '123'
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(userData);
      await usersService.update(passwordData).catch(error => {
        expect(error).toBeInstanceOf(Error)
        expect(error).toMatchObject({
          message: "Password size must be equal to 4!"
        })
      })
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(updateMock).toBeCalledTimes(0);
    })

    it('should be able to update a user password', async () => {
      const userData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        name: "Wilton",
        email: "wilton@example.com",
        admin: true,
      }
      const passwordData = {
        id: "453eea87-7416-40f4-9e37-e064e5fed963",
        password: '1234'
      }
      getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
      const usersService = new UsersService();
      findOneMock.mockReturnValue(userData);
      await usersService.update(passwordData)
      expect(getCustomRepository).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(updateMock).toBeCalledTimes(1);
    })
  })
})
