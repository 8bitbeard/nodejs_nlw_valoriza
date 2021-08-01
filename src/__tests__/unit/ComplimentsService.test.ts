import { Repository } from "typeorm";
import "typeorm/repository/Repository";
import { getCustomRepository } from "typeorm";
import { mocked } from 'ts-jest/utils'
import { ComplimentsRepositories } from "../../repositories/ComplimentsRepositories";
import { UsersRepositories } from "../../repositories/UsersRepositories";
import { TagsRepositories } from "../../repositories/TagsRepositories";
import { ComplimentsService } from "../../services/ComplimentsService";

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
  OneToMany: jest.fn()
}));

describe('ComplimentsService', () => {
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

  describe('searchBySender', () => {

    beforeEach(async () => {
      jest.resetAllMocks();
      // getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
    });

    it('should return an empty list when there is no compliments on the database', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(complimentsRepositories);
      const complimentsService = new ComplimentsService();
      findMock.mockReturnValueOnce([]);
      await complimentsService.searchBySender('123');
      expect(getCustomRepositoryMock).toBeCalledTimes(1);
      expect(findMock).toBeCalledTimes(1);
    })
  })

  describe('searchByReceiver', () => {
    beforeEach(async () => {
      jest.resetAllMocks();
    })

    it('should return an empty list when there is no compliments on the database', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(complimentsRepositories);
      const complimentsService = new ComplimentsService();
      findMock.mockReturnValueOnce([])
      await complimentsService.searchByReceiver('123');
      expect(getCustomRepositoryMock).toBeCalledTimes(1);
      expect(findMock).toBeCalledTimes(1);
    })
  })

  describe('updateMessage', () => {
    beforeEach(async () => {
      jest.resetAllMocks();
    })

    it('should return an error when no compliments is found with given id', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(complimentsRepositories);
      const complimentsService = new ComplimentsService();
      findOneMock.mockReturnValueOnce(null);
      await complimentsService.updateMessage('123', '123', 'message').catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: "Compliment not found!"
        })
      })
      expect(getCustomRepositoryMock).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
    })

    it('should return an error when an user tries to edit a compliment that he did not create', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(complimentsRepositories);
      const complimentsService = new ComplimentsService();
      findOneMock.mockReturnValueOnce({
        id: "507c663c-e971-4b99-a485-b3f0db501893",
        user_sender: "453eea87-7416-40f4-9e37-e064e5fed963",
        user_receiver: "ce1c54f7-7c90-456f-ba55-5fbcbdc86f0a",
        tag_id: "8f42f366-a220-45a8-b6cb-c7e94b438866",
        message: "Changing the compliments message2!",
        created_at: "2021-07-11T20:43:30.000Z"
      })
      await complimentsService.updateMessage('123', '123', 'message').catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: "Only the compliment owner can change its message!"
        })
      })
      expect(getCustomRepositoryMock).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
    })

    it('should return an error when trying to edit a compliment without sendid a message', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(complimentsRepositories);
      const complimentsService = new ComplimentsService();
      findOneMock.mockReturnValueOnce({
        id: "507c663c-e971-4b99-a485-b3f0db501893",
        user_sender: "453eea87-7416-40f4-9e37-e064e5fed963",
        user_receiver: "ce1c54f7-7c90-456f-ba55-5fbcbdc86f0a",
        tag_id: "8f42f366-a220-45a8-b6cb-c7e94b438866",
        message: "Changing the compliments message2!",
        created_at: "2021-07-11T20:43:30.000Z"
      })
      await complimentsService.updateMessage('453eea87-7416-40f4-9e37-e064e5fed963', '123', null).catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: "The informed message is invalid"
        })
      })
    })

    it('should be able to edit an existing compliment', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(complimentsRepositories);
      const complimentsService = new ComplimentsService();
      findOneMock.mockReturnValueOnce({
        id: "507c663c-e971-4b99-a485-b3f0db501893",
        user_sender: "453eea87-7416-40f4-9e37-e064e5fed963",
        user_receiver: "ce1c54f7-7c90-456f-ba55-5fbcbdc86f0a",
        tag_id: "8f42f366-a220-45a8-b6cb-c7e94b438866",
        message: "Changing the compliments message2!",
        created_at: "2021-07-11T20:43:30.000Z"
      })
      saveMock.mockReturnValueOnce(true)
      await complimentsService.updateMessage('453eea87-7416-40f4-9e37-e064e5fed963', '123', 'Message');
      expect(getCustomRepositoryMock).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
      expect(saveMock).toBeCalledTimes(1);
    })
  })

  describe('create', () => {

    beforeEach(async () => {
      jest.resetAllMocks();
      // getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
    });

    it('should return an error when a user tries to create a compliment to himself', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(complimentsRepositories)
      .mockReturnValueOnce(usersRepositories)
      .mockReturnValueOnce(tagsRepositories);
      const complimentsService = new ComplimentsService();
      await complimentsService.create({
        tag_id: '123',
        user_sender: '123',
        user_receiver: '123',
        message: '123'
      }).catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: 'Incorrect User Receiver'
        })
      })
    })

    it('should return an error when trying to create a compliment on an inexistent tag', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(complimentsRepositories)
      .mockReturnValueOnce(usersRepositories)
      .mockReturnValueOnce(tagsRepositories);
      const complimentsService = new ComplimentsService();
      findOneMock.mockReturnValueOnce(null)
      await complimentsService.create({
        tag_id: '123',
        user_sender: '12',
        user_receiver: '123',
        message: '123'
      }).catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: 'Tag does not exists!'
        })
      })
    })

    it('should return an error when trying to create a compliment to an inexistent user', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(complimentsRepositories)
      .mockReturnValueOnce(usersRepositories)
      .mockReturnValueOnce(tagsRepositories);
      const complimentsService = new ComplimentsService();
      findOneMock.mockReturnValueOnce(true).mockReturnValueOnce(null);
      await complimentsService.create({
        tag_id: '123',
        user_sender: '12',
        user_receiver: '123',
        message: '123'
      }).catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: 'User Receiver does not exists!'
        })
      })
    })

    it('should be able to create a compliment', async () => {
      const complimentData = {
        id: '1234',
        user_sender: '123',
        user_receiver: '1234',
        tag_id: '1234',
        message: '1234',
        created_at: '1234'
      }
      getCustomRepositoryMock.mockReturnValueOnce(complimentsRepositories).mockReturnValueOnce(usersRepositories).mockReturnValueOnce(tagsRepositories);
      const complimentsService = new ComplimentsService();
      findOneMock.mockReturnValueOnce(true).mockReturnValueOnce(true);
      createMock.mockReturnValueOnce(complimentData);
      saveMock.mockReturnValueOnce(true);
      const compliment = await complimentsService.create({
        tag_id: complimentData.tag_id,
        user_sender: complimentData.user_sender,
        user_receiver: complimentData.user_receiver,
        message: complimentData.message
      })
      expect(getCustomRepositoryMock).toBeCalledTimes(3)
      expect(findOneMock).toBeCalledTimes(2);
      expect(createMock).toBeCalledTimes(1);
      expect(saveMock).toBeCalledTimes(1);
      expect(compliment).toMatchObject(complimentData);
    })
  })

  describe('remove', () => {

    beforeEach(async () => {
      jest.resetAllMocks();
      // getCustomRepositoryMock.mockReturnValueOnce(usersRepositories);
    });

    it('should return an error when truing to delete an inexistent compliment', async () => {
      getCustomRepositoryMock.mockReturnValueOnce(complimentsRepositories);
      findOneMock.mockReturnValueOnce(null);
      const complimentsService = new ComplimentsService();
      await complimentsService.remove('123',' 123').catch(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({
          message: 'Compliment not found!'
        })
      })
      expect(getCustomRepositoryMock).toBeCalledTimes(1);
      expect(findOneMock).toBeCalledTimes(1);
    })

    it('should be able to delete a existing compliment', async () => {
      const complimentData = {
        id: '1234',
        user_sender: '123',
        user_receiver: '1234',
        tag_id: '1234',
        message: '1234',
        created_at: '1234'
      }
      getCustomRepositoryMock.mockReturnValueOnce(complimentsRepositories);
      findOneMock.mockReturnValueOnce(complimentData);
      const complimentsService = new ComplimentsService();
      await complimentsService.remove('1234', '1234');
      expect(findOneMock).toBeCalledTimes(1);
      expect(getCustomRepositoryMock).toBeCalledTimes(1);
    })
  })
})
