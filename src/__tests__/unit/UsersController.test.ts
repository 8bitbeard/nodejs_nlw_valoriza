import { UsersService } from "../../services/UsersService";
import { UsersController } from "../../controllers/UsersController";

jest.mock('../../services/UsersService');

describe('UsersController', () => {
  const createMock = jest.fn();
  const indexMock = jest.fn();
  const searchMock = jest.fn();
  const editMock = jest.fn();
  const removeMock = jest.fn();
  const updateMock = jest.fn();

  beforeAll(() => {
    UsersService.prototype.create = createMock;
    UsersService.prototype.index = indexMock;
    UsersService.prototype.search = searchMock;
    UsersService.prototype.edit = editMock;
    UsersService.prototype.remove = removeMock;
    UsersService.prototype.update = updateMock;
  })


  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  }

  describe('create', () => {

    const mockRequest: any = {
      body: {
        name: 'Example',
        email: 'example@example.net',
        admin: true,
        password: '1234'
      }
    }

    it('should return an error with status 400', async () => {
      createMock.mockRejectedValueOnce(new Error());
      const usersController = new UsersController();
      await usersController.create(mockRequest, mockResponse).catch(error => {
        expect(error).toBeInstanceOf(Error);
      })
      expect(createMock).toBeCalledTimes(1);
    })

    it('should create a user with status 201', async () => {
      const userData = {
        id: "468f6219-3386-420b-beb3-dcacccacc9fe",
        name: "Example",
        email: "example@example.com",
        admin: true,
        password: "$2a$08$bubL89Y8C5u2FUOtIskCeeUlcqUXOr5voQsNxWmA1rtIcq1YoWFoq",
        created_at: "2021-07-10T14:41:25.000Z",
        updated_at: "2021-07-10T14:41:25.000Z"
      }
      createMock.mockResolvedValueOnce(userData)
      const userscontroller = new UsersController();
      await userscontroller.create(mockRequest, mockResponse)
      expect(mockResponse.status).toBeCalledWith(201);
      expect(mockResponse.json).toBeCalledWith(userData);
    })
  })

  describe('index', () => {

    let mockRequest: any = {
      query: {
        name: 'Example',
        email: 'example@example.net'
      }
    }

    it('should return an error with status 400', async () => {
      indexMock.mockRejectedValueOnce(new Error());
      const usersController = new UsersController();
      await usersController.index(mockRequest, mockResponse).catch(error => {
        expect(error).toBeInstanceOf(Error);
      })
      expect(indexMock).toBeCalledTimes(1);
    })

    it('should return an empty list when no user is found', async () => {
      indexMock.mockResolvedValueOnce([]);
      const usersController = new UsersController();
      await usersController.index(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledWith(200);
    })

    it('should return a list of users when searched with only name', async () => {
      mockRequest = {
        query: {
          name: 'Example',
        }
      }
      const userData = [{
        id: "468f6219-3386-420b-beb3-dcacccacc9fe",
        name: "Example",
        email: "example@example.com",
        admin: true,
        password: "$2a$08$bubL89Y8C5u2FUOtIskCeeUlcqUXOr5voQsNxWmA1rtIcq1YoWFoq",
        created_at: "2021-07-10T14:41:25.000Z",
        updated_at: "2021-07-10T14:41:25.000Z"
      }]
      indexMock.mockResolvedValueOnce(userData);
      const usersController = new UsersController();
      await usersController.index(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledWith(200);
      expect(mockResponse.json).toBeCalledWith(userData);
    })

    it('should return a list of users when searched with only email', async () => {
      mockRequest = {
        query: {
          email: 'example@example.com',
        }
      }
      const userData = [{
        id: "468f6219-3386-420b-beb3-dcacccacc9fe",
        name: "Example",
        email: "example@example.com",
        admin: true,
        password: "$2a$08$bubL89Y8C5u2FUOtIskCeeUlcqUXOr5voQsNxWmA1rtIcq1YoWFoq",
        created_at: "2021-07-10T14:41:25.000Z",
        updated_at: "2021-07-10T14:41:25.000Z"
      }]
      indexMock.mockResolvedValueOnce(userData);
      const usersController = new UsersController();
      await usersController.index(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledWith(200);
      expect(mockResponse.json).toBeCalledWith(userData);
    })
  })

  describe('search', () => {
    let mockRequest: any = {
      params: {
        id: '468f6219-3386-420b-beb3-dcacccacc9fe'
      }
    }

    it('should return an error with status 400', async () => {
      searchMock.mockRejectedValueOnce(new Error());
      const usersController = new UsersController();
      await usersController.search(mockRequest, mockResponse).catch(error => {
        expect(error).toBeInstanceOf(Error);
      })
      expect(searchMock).toBeCalledTimes(1);
    })

    it('should return an user', async () => {
      const userData = {
        id: "468f6219-3386-420b-beb3-dcacccacc9fe",
        name: "Example",
        email: "example@example.com",
        admin: true,
        password: "$2a$08$bubL89Y8C5u2FUOtIskCeeUlcqUXOr5voQsNxWmA1rtIcq1YoWFoq",
        created_at: "2021-07-10T14:41:25.000Z",
        updated_at: "2021-07-10T14:41:25.000Z"
      }
      searchMock.mockResolvedValueOnce(userData);
      const userscontroller = new UsersController();
      await userscontroller.search(mockRequest, mockResponse)
      expect(mockResponse.status).toBeCalledWith(200);
      expect(mockResponse.json).toBeCalledWith(userData)
    })
  })

  describe('edit', () => {
    const mockRequest: any = {
      body: {
        name: 'Example',
        email: 'example@example.net',
        admin: true,
        password: '1234'
      }
    }

    it('should return an error with status 400', async () => {
      editMock.mockRejectedValueOnce(new Error());
      const usersController = new UsersController();
      await usersController.edit(mockRequest, mockResponse).catch(error => {
        expect(error).toBeInstanceOf(Error);
      })
      expect(editMock).toBeCalledTimes(1);
    })

    it('should be able to edit an existing user', async () => {
      editMock.mockResolvedValueOnce(true);
      const usersController = new UsersController();
      await usersController.edit(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledWith(204);
      // expect(mockResponse.json).toBeCalledWith()
    })
  })

  describe('remove', () => {
    const mockRequest: any = {
      user_id: '1234',
      params: {
        id: '1234'
      }
    }

    it('should return an error with status 400', async () => {
      removeMock.mockRejectedValueOnce(new Error());
      const usersController = new UsersController();
      await usersController.remove(mockRequest, mockResponse).catch(error => {
        expect(error).toBeInstanceOf(Error);
      })
      expect(removeMock).toBeCalledTimes(1);
    })

    
    it('should be able to remove an existing user', async () => {
      removeMock.mockResolvedValueOnce(true);
      const usersController = new UsersController();
      await usersController.remove(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledWith(204);
      expect(mockResponse.json).toBeCalledWith(true)
    })
  })

  describe('update', () => {
    const mockRequest: any = {
      user_id: '1234',
      body: {
        password: '1234'
      }
    }

    it('should return an error with status 400', async () => {
      updateMock.mockRejectedValueOnce(new Error());
      const usersController = new UsersController();
      await usersController.update(mockRequest, mockResponse).catch(error => {
        expect(error).toBeInstanceOf(Error);
      })
      expect(updateMock).toBeCalledTimes(1);
    })

    it('should be update the password of logged user', async () => {
      updateMock.mockResolvedValueOnce(true);
      const usersController = new UsersController();
      await usersController.update(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledWith(200);
      expect(mockResponse.json).toBeCalledWith()
    })
  })
})
