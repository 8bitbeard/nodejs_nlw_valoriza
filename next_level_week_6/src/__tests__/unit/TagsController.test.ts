import { TagsController } from "../../controllers/TagsController";
import { TagsService } from "../../services/TagsService";

jest.mock("../../services/TagsService");

describe('TagsController', () =>{

  const createMock = jest.fn();
  const searchMock = jest.fn();

  beforeAll(() => {
    TagsService.prototype.create = createMock;
    TagsService.prototype.search = searchMock;
  })

  describe('create', () => {

    const mockRequest: any = {
      body: {
        name: 'Unit Test Mock'
      }
    }

    const mockResponse: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    it('should return an error with status 400', async () => {
      createMock.mockRejectedValueOnce(new Error());
      const tagsController = new TagsController();
      await tagsController.create(mockRequest, mockResponse).catch(error => {
        expect(error).toBeInstanceOf(Error);
      });
      expect(createMock).toBeCalledTimes(1);
    })

    it('should create a tag successfully', async () => {
      const tagData = {
        id: "8f42f366-a220-45a8-b6cb-c7e94b438866",
        name: "Optimistic",
        created_at: "2021-07-10T15:49:25.000Z",
        updated_at: "2021-07-10T15:49:25.000Z"
      }
      createMock.mockResolvedValueOnce(tagData);
      const tagsController = new TagsController();
      await tagsController.create(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledWith(201);
      expect(mockResponse.json).toBeCalledWith(tagData);
    })
  })

  describe('search', () => {
    const mockRequest: any = {}

    const mockResponse: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    it('should return an error with status 400', async () => {
      searchMock.mockRejectedValueOnce(new Error());
      const tagsController = new TagsController();
      await tagsController.search(mockRequest, mockResponse).catch(error => {
        expect(error).toBeInstanceOf(Error);
      })
      expect(searchMock).toBeCalledTimes(1);
    })

    it('should return a list of tags', async () => {
      const tagData = [{
        id: "8f42f366-a220-45a8-b6cb-c7e94b438866",
        name: "Optimistic",
        created_at: "2021-07-10T15:49:25.000Z",
        updated_at: "2021-07-10T15:49:25.000Z"
      }]
      searchMock.mockResolvedValueOnce(tagData);
      const tagsController = new TagsController();
      await tagsController.search(mockRequest, mockResponse)
      expect(searchMock).toBeCalledTimes(1);
      expect(mockResponse.status).toBeCalledWith(200);
      expect(mockResponse.json).toBeCalledWith(tagData);
    })
  })
})