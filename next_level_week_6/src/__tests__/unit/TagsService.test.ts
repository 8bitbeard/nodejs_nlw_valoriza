import { Repository } from "typeorm";
import "typeorm/repository/Repository";
import { getCustomRepository } from "typeorm";
import { mocked } from 'ts-jest/utils'
import { ComplimentsRepositories } from "../../repositories/ComplimentsRepositories";
import { UsersRepositories } from "../../repositories/UsersRepositories";
import { TagsRepositories } from "../../repositories/TagsRepositories";
import { ComplimentsService } from "../../services/ComplimentsService";
import { TagsService } from "../../services/TagsService";

jest.mock('typeorm', () => ({
  __esModule: true,
  getCustomRepository: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  PrimaryColumn: jest.fn(),
  JoinColumn: jest.fn(),
  ManyToOne: jest.fn(),
  Column: jest.fn(),
  CreateDateColumn: jest.fn(),
  UpdateDateColumn: jest.fn(),
  Entity: jest.fn(),
  EntityRepository: jest.fn(),
  Repository: jest.fn(),
}));

describe('TagsService', () => {
  const getCustomRepositoryMock = mocked(getCustomRepository);
  const findOneMock = jest.fn();
  const findMock = jest.fn();
  const createMock = jest.fn();
  const saveMock = jest.fn();
  const updateMock = jest.fn();
  const deleteMock = jest.fn();
  let complimentsRepositories: ComplimentsRepositories
  let usersRepositories: UsersRepositories
  let tagsRepositories: TagsRepositories

  beforeAll(() => {
    jest.mock("typeorm/repository/Repository");
    Repository.prototype.findOne = findOneMock;
    Repository.prototype.find = findMock;
    Repository.prototype.create = createMock;
    Repository.prototype.save = saveMock;
    Repository.prototype.update = updateMock;
    Repository.prototype.delete = deleteMock;
    complimentsRepositories = new ComplimentsRepositories();
    usersRepositories = new UsersRepositories();
    tagsRepositories = new TagsRepositories();
  })

  beforeEach(async () => {
    jest.resetAllMocks();
    // getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
  });

  describe('create', () => {

    it('should return an error when trying to create a tag without name', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(tagsRepositories);
      const tagsService = new TagsService();
      await tagsService.create('').catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: 'Incorrect name!'
        })
      })
      expect(getCustomRepositoryMock).toBeCalledTimes(1);
    })

    it('should return an error when trying to create a tag with a name bigger than 25 chars', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(tagsRepositories);
      const tagsService = new TagsService();
      await tagsService.create('ACKELDKJFKDLOEPSLDKOIRPDOF').catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: 'Tag name must have a maximum size of 25 chars!'
        })
      })
      expect(getCustomRepositoryMock).toBeCalledTimes(1);
    })

    it('should return an error when trying to create a tag an already existing name', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(tagsRepositories);
      const tagsService = new TagsService();
      findOneMock.mockReturnValueOnce(true);
      await tagsService.create('UnitTest').catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: 'Tag already exists!'
        })
      })
      expect(getCustomRepositoryMock).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
    })

    it('should be able to create a tag', async () => {
      const tagData = {
        id: "8f42f366-a220-45a8-b6cb-c7e94b438866",
        name: "Optimistic",
        created_at: "2021-07-10T15:49:25.000Z",
        updated_at: "2021-07-10T15:49:25.000Z"
      }
      getCustomRepositoryMock.mockReturnValueOnce(tagsRepositories);
      const tagsService = new TagsService();
      findOneMock.mockReturnValueOnce(null);
      createMock.mockReturnValueOnce(tagData);
      saveMock.mockReturnValueOnce(true);
      const tag = await tagsService.create(tagData.name);
      expect(getCustomRepositoryMock).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(createMock).toBeCalledTimes(1);
      expect(saveMock).toBeCalledTimes(1);
      expect(tag).toMatchObject(tagData);
    })
  })

  describe('search', () => {

    it('should return an empty list when there is no tags on the DB', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(tagsRepositories);
      const tagsService = new TagsService();
      findMock.mockReturnValueOnce([]);
      const tags = await tagsService.search();
      expect(tags).toStrictEqual([]);
      expect(getCustomRepositoryMock).toBeCalledTimes(1);
      expect(findMock).toBeCalledTimes(1);
    })
  })
})