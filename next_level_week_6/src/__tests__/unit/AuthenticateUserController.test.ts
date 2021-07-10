import { AuthenticateUserController } from "../../controllers/AuthenticateUserController";
import { AuthenticateUserService } from "../../services/AuthenticateUserService"

jest.mock("../../services/AuthenticateUserService");

describe("AuthenticateUserController", () => {
  describe('handle', () => {

    const executeMock = jest.fn();

    beforeAll(() => {
      AuthenticateUserService.prototype.execute = executeMock;
    })

    beforeEach(async () => {
      // jest.resetAllMocks();
    });

    const mockRequest: any = {
      body: {
        email: 'example@example.net',
        password: '1234'
      }
    }

    const mockResponse: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }

    it('should do something', async () => {
      executeMock.mockRejectedValue(new Error())
      const authenticateUserController = new AuthenticateUserController();
      await authenticateUserController.handle(mockRequest, mockResponse).catch(error => {
        expect(error).toBeInstanceOf(Error)
      })
      expect(executeMock).toBeCalledTimes(1);
    })

    it('should do something', async () => {
      executeMock.mockResolvedValueOnce('Test-token')
      const authenticateUserController = new AuthenticateUserController();
      await authenticateUserController.handle(mockRequest, mockResponse);
      expect(executeMock).toBeCalledTimes(1);
      expect(mockResponse.status).toBeCalledWith(200);
      expect(mockResponse.json).toBeCalledWith('Test-token');
    })
  })
})