import { Repository } from "typeorm";
import "typeorm/repository/Repository";
import { UsersRepositories } from "../../repositories/UsersRepositories";

describe('UsersRepositories', () => {
  const findOneMock = jest.fn();
  const updateMock = jest.fn();
  const createMock = jest.fn();
  const deleteMock = jest.fn();
  const saveMock = jest.fn();
  const findMock = jest.fn();
  let usersRepositories: UsersRepositories

  beforeAll(() => {
    jest.mock("typeorm/repository/Repository");
    Repository.prototype.findOne = findOneMock;
    Repository.prototype.find = findMock;
    Repository.prototype.create = createMock;
    Repository.prototype.save = saveMock;
    Repository.prototype.update = updateMock;
    Repository.prototype.delete = deleteMock;
  })

  beforeEach(async () => {
    usersRepositories = new UsersRepositories();
    jest.resetAllMocks();
  });

  describe('findOne', () => {
    it('should call findOne only once', async () => {
      findOneMock.mockReturnValue({name: 'test'})
      await usersRepositories.findOne();
      expect(findOneMock).toBeCalledTimes(1);
    })
  })
})

