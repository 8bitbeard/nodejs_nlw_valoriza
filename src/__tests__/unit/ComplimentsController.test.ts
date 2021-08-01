import { ComplimentsController } from "../../controllers/ComplimentsController";
import { ComplimentsService } from "../../services/ComplimentsService";

jest.mock("../../services/ComplimentsService");

describe('ComplimentsController', () => {
  const searchBySenderMock = jest.fn();
  const searchByReceiverMock = jest.fn();
  const updateMessageMock = jest.fn();
  const createMock = jest.fn();
  const removeMock = jest.fn();

  beforeAll(() => {
    ComplimentsService.prototype.searchBySender = searchBySenderMock;
    ComplimentsService.prototype.searchByReceiver = searchByReceiverMock;
    ComplimentsService.prototype.updateMessage = updateMessageMock;
    ComplimentsService.prototype.create = createMock;
    ComplimentsService.prototype.remove = removeMock;
  })

  beforeEach(async () => {
    // jest.resetAllMocks();
  });

  describe('searchBySender', () => {
    const mockRequest: any = {
      body: {
        email: 'example@example.net',
        password: '1234'
      }
    }

    const mockResponse: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    it('should return an empty list when there is no sent compliments on DB', async () => {
      searchBySenderMock.mockResolvedValueOnce([])
      const complimentsController = new ComplimentsController();
      await complimentsController.searchBySender(mockRequest, mockResponse);
      expect(searchBySenderMock).toBeCalledTimes(1);
      expect(mockResponse.status).toBeCalledWith(200);
      expect(mockResponse.json).toBeCalledWith([]);
    })

    it('should return a list of sent compliments', async () => {
      const complimentsData = [{
        id: "ecf3bc00-2185-4a1d-84e5-0e92eee88588",
        user_sender: "468f6219-3386-420b-beb3-dcacccacc9fe",
        user_receiver: "453eea87-7416-40f4-9e37-e064e5fed963",
        tag_id: "8f42f366-a220-45a8-b6cb-c7e94b438866",
        message: "You are fenomenal!",
        created_at: "2021-07-10T15:50:24.000Z"
      }]
      searchBySenderMock.mockResolvedValueOnce(complimentsData);
      const complimentsController = new ComplimentsController();
      await complimentsController.searchBySender(mockRequest, mockResponse);
      expect(searchBySenderMock).toBeCalledTimes(1);
      expect(mockResponse.status).toBeCalledWith(200);
      expect(mockResponse.json).toBeCalledWith(complimentsData)
    })
  })

  describe('searchByReceiver', () => {
    const mockRequest: any = {
      body: {
        email: 'example@example.net',
        password: '1234'
      }
    }

    const mockResponse: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    it('should return an empty list when there is no received compliments on DB', async () => {
      searchByReceiverMock.mockResolvedValueOnce([]);
      const complimentsController = new ComplimentsController();
      await complimentsController.searchByReceiver(mockRequest, mockResponse);
      expect(searchByReceiverMock).toBeCalledTimes(1);
      expect(mockResponse.status).toBeCalledWith(200);
      expect(mockResponse.json).toBeCalledWith([]);
    })

    it('should return a list of received compliments', async () => {
      const complimentsData = [{
        id: "ecf3bc00-2185-4a1d-84e5-0e92eee88588",
        user_sender: "468f6219-3386-420b-beb3-dcacccacc9fe",
        user_receiver: "453eea87-7416-40f4-9e37-e064e5fed963",
        tag_id: "8f42f366-a220-45a8-b6cb-c7e94b438866",
        message: "You are fenomenal!",
        created_at: "2021-07-10T15:50:24.000Z"
      }]
      searchByReceiverMock.mockResolvedValueOnce(complimentsData);
      const complimentsController = new ComplimentsController();
      await complimentsController.searchByReceiver(mockRequest, mockResponse);
      expect(searchByReceiverMock).toBeCalledTimes(1);
      expect(mockResponse.status).toBeCalledWith(200);
      expect(mockResponse.json).toBeCalledWith(complimentsData)
    })
  })

  describe('updateMessage', () => {
    const mockRequest: any = {
      body: {
        message: 'This is a message',
      },
      params: {
        id: '123'
      },
      user_id: '123'
    }

    const mockResponse: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    it('should return an error when no compliment is found', async () => {
      updateMessageMock.mockRejectedValue(new Error());
      const complimentsController = new ComplimentsController();
      await complimentsController.updateMessage(mockRequest, mockResponse).catch(error => {
        expect(error).toBeInstanceOf(Error);
      });
      expect(updateMessageMock).toBeCalledTimes(1);
    })

    it('should be able to update the compliment message value', async () => {
      updateMessageMock.mockResolvedValue(true);
      const complimentsController = new ComplimentsController();
      await complimentsController.updateMessage(mockRequest, mockResponse);
      expect(updateMessageMock).toBeCalledTimes(1);
      expect(mockResponse.status).toBeCalledWith(204);
      expect(mockResponse.json).toBeCalledWith();
    })
  })

  describe('create', () => {
    const mockRequest: any = {
      user_id: '123',
      body: {
        tag_id: '123',
        user_receiver: '123',
        message: 'Unit test message'
      }
    }

    const mockResponse: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    it('should return an error with status 400', async () => {
      createMock.mockRejectedValueOnce(new Error());
      const complimentsController = new ComplimentsController();
      await complimentsController.create(mockRequest, mockResponse).catch(error => {
        expect(error).toBeInstanceOf(Error);
      });
      expect(createMock).toBeCalledTimes(1);
    })

    it('should create a compliment and return its data on response with status 201', async () => {
      const complimentData = {
        id: "ecf3bc00-2185-4a1d-84e5-0e92eee88588",
        user_sender: "468f6219-3386-420b-beb3-dcacccacc9fe",
        user_receiver: "453eea87-7416-40f4-9e37-e064e5fed963",
        tag_id: "8f42f366-a220-45a8-b6cb-c7e94b438866",
        message: "You are fenomenal!",
        created_at: "2021-07-10T15:50:24.000Z"
      }
      createMock.mockResolvedValueOnce(complimentData);
      const complimentsController = new ComplimentsController();
      await complimentsController.create(mockRequest, mockResponse);
      expect(createMock).toBeCalledTimes(1);
      expect(mockResponse.status).toBeCalledWith(201);
      expect(mockResponse.json).toBeCalledWith(complimentData);
    })
  })

  describe('remove', () => {
    const mockRequest: any = {
      user_id: '123',
      body: {
        tag_id: '123',
        user_receiver: '123',
        message: 'Unit test message'
      },
      params: {
        id: '1234'
      }
    }

    const mockResponse: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    it('should return an error with status 400', async () => {
      removeMock.mockRejectedValueOnce(new Error());
      const complimentsController = new ComplimentsController();
      await complimentsController.remove(mockRequest, mockResponse).catch(error => {
        expect(error).toBeInstanceOf(Error);
      })
      expect(removeMock).toBeCalledTimes(1);
    })

    it('sohuld be able to remove compliments', async () => {
      removeMock.mockResolvedValueOnce(true);
      const complimentsController = new ComplimentsController();
      await complimentsController.remove(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledWith(204);
      expect(removeMock).toBeCalledTimes(1);
    })
  })
})
