import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../../app';
import createConnection from "../../database";

describe('AuthenticateUsers', () => {
  beforeEach(async() => {
    const connection = await createConnection();

    await connection.runMigrations();
  })

  afterEach(async () => {
    const connection = getConnection();

    await connection.dropDatabase();

    await connection.close();
  })

  describe('POST /v1/login', () => {
    it('should be able to authenticate with a normal user with valid credentials', async () => {
      await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User',
        email: 'user@example.com',
        password: '1234'
      })

      const response = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@example.com',
        password: '1234'
      })

      expect(response.status).toBe(200);
    })

    it('should be able to authenticate with a admin user with valid credentials', async () => {
      await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User',
        email: 'user@example.com',
        password: '1234',
        admin: true
      })

      const response = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@example.com',
        password: '1234'
      })

      expect(response.status).toBe(200);
    })

    it('should not be able to authenticate with a invalid email adress', async () => {
      const response = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@example.com',
        password: '1234'
      })

      expect(response.status).toBe(400)
    })

    it('should not be able to authenticate with a invalid admin user password', async () => {
      await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User',
        email: 'user@example.com',
        password: '1234',
        admin: true
      })

      const response = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@example.com',
        password: '2345'
      })

      expect(response.status).toBe(400)
    })

    it('should not be able to authenticate with a invalid normal user password', async () => {
      await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User',
        email: 'user@example.com',
        password: '1234'
      })

      const response = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@example.com',
        password: '2345'
      })

      expect(response.status).toBe(400)
    })
  })
})