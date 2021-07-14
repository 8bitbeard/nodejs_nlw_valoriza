import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../../app';
import createConnection from "../../database";

describe('User', () => {

  beforeEach(async() => {
    const connection = await createConnection();

    await connection.runMigrations();
  })

  afterEach(async () => {
    const connection = getConnection();

    await connection.dropDatabase();

    await connection.close();
  })

  describe('POST /v1/tags', () => {
    it('should be able to create a tag authenticated with a admin user', async () => {
      await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User',
        email: 'user@user.com',
        password: '1234',
        admin: true
      })

      const tokenResponse = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@user.com',
        password: '1234'
      })

      const response = await request(app).post('/nlw-valoriza/v1/tags').set(
        'Authorization', `Bearer ${tokenResponse.body.access_token}`
      ).send({
        name: 'Optmistic'
      })

      expect(response.status).toBe(201)
    })

    it('should not be able to create a tag authenticated with a normal user', async () => {
      await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User',
        email: 'user@user.com',
        password: '1234'
      })

      const tokenResponse = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@user.com',
        password: '1234'
      })

      const response = await request(app).post('/nlw-valoriza/v1/tags').set(
        'Authorization', `Bearer ${tokenResponse.body.access_token}`
      ).send({
        name: 'Optmistic'
      })

      expect(response.status).toBe(401)
    })

    it('should not be able to create a tag without beign authenticated', async () => {
      const response = await request(app).post('/nlw-valoriza/v1/tags').send({
        name: 'Optmistic'
      })

      expect(response.status).toBe(401)
    })

    it('should not be able to create a tag without passing the name', async () => {
      await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User',
        email: 'user@user.com',
        password: '1234',
        admin: true
      })

      const tokenResponse = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@user.com',
        password: '1234'
      })

      const response = await request(app).post('/nlw-valoriza/v1/tags').set(
        'Authorization', `Bearer ${tokenResponse.body.access_token}`
      ).send({})

      expect(response.status).toBe(400);
    })

    it('should not be able to create a tag with a empty name', async () => {
      await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User',
        email: 'user@user.com',
        password: '1234',
        admin: true
      })

      const tokenResponse = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@user.com',
        password: '1234'
      })

      const response = await request(app).post('/nlw-valoriza/v1/tags').set(
        'Authorization', `Bearer ${tokenResponse.body.access_token}`
      ).send({
        name: ''
      })

      expect(response.status).toBe(400);
    })

    it('should not be able to create a tag with an already existing name', async() => {
      await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User',
        email: 'user@user.com',
        password: '1234',
        admin: true
      })

      const tokenResponse = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@user.com',
        password: '1234'
      })

      await request(app).post('/nlw-valoriza/v1/tags').set(
        'Authorization', `Bearer ${tokenResponse.body.access_token}`
      ).send({
        name: 'Optmistic'
      })

      const response = await request(app).post('/nlw-valoriza/v1/tags').set(
        'Authorization', `Bearer ${tokenResponse.body.access_token}`
      ).send({
        name: 'Optmistic'
      })

      expect(response.status).toBe(400);
    })

    it('should not be able to create a tag with a name that contains more than 50 characters', async () => {
      await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User',
        email: 'user@user.com',
        password: '1234',
        admin: true
      })

      const tokenResponse = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@user.com',
        password: '1234'
      })

      const response = await request(app).post('/nlw-valoriza/v1/tags').set(
        'Authorization', `Bearer ${tokenResponse.body.access_token}`
      ).send({
        name: 'ASDFASDFASDFASDFASDFASDFASDFASDFASDFASDFASDFASDFASAS'
      })

      expect(response.status).toBe(400);
    })
  })

  describe('GET /v1/tags', () => {
    it('should be able to list all registered tags with a authenticated normal user', async () => {
      await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User',
        email: 'user@user.com',
        password: '1234'
      })

      await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User2',
        email: 'user2@user.com',
        password: '1234',
        admin: true
      })

      const normalToken = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@user.com',
        password: '1234'
      })

      const adminToken = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user2@user.com',
        password: '1234'
      })

      await request(app).post('/nlw-valoriza/v1/tags').set({
        'Authorization': `Bearer ${adminToken.body.access_token}`
      }).send({
        name: 'Optmistic'
      })

      const response = await request(app).get('/nlw-valoriza/v1/tags').set({
        'Authorization': `Bearer ${normalToken.body.access_token}`
      })

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
    })

    it('should be able to list all registered tags with a authenticated admin user', async () => {
      await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User',
        email: 'user@user.com',
        password: '1234',
        admin: true
      })

      const adminToken = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@user.com',
        password: '1234'
      })

      await request(app).post('/nlw-valoriza/v1/tags').set({
        'Authorization': `Bearer ${adminToken.body.access_token}`
      }).send({
        name: 'Optmistic'
      })

      const response = await request(app).get('/nlw-valoriza/v1/tags').set({
        'Authorization': `Bearer ${adminToken.body.access_token}`
      })

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
    })

    it('should not be able to list all registered tags without beign authenticated', async () => {
      const response = await request(app).post('/nlw-valoriza/v1/tags').send({
        name: 'Optmistic'
      })

      expect(response.status).toBe(401)
    })
  })

  describe('PUT /v1/tags', () => {
    it('should not be able to update a tag name without beign authenticated', async() => {
      const response = await request(app).put('/nlw-valoriza/v1/tags').send({
        id: '8f42f366-a220-45a8-b6cb-c7e94b438866',
        name: 'Optmistic'
      })
      expect(response.status).toBe(401);
    })

    it('should not be able to update a tag name witn an authenticated normal user', async () => {
      const userData = await request(app).post('/nlw-valoriza/v1/users').send({
        name: 'User',
        email: 'user@user.com',
        password: '1234'
      })

      const tokenData = await request(app).post('/nlw-valoriza/v1/login').send({
        email: 'user@user.com',
        password: '1234'
      })

      const response = await request(app).put('/nlw-valoriza/v1/tags').set(
        'Authorization', `Bearer ${tokenData.body.access_token}`
      ).send({
        id: '8f42f366-a220-45a8-b6cb-c7e94b438866',
        name: 'Optmistic'
      })

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        error: "Unauthorized"
      })
    })

    it('should not be able to update a tag name without informing the new name', async() => {
      const userData = {
        name: 'User',
        email: 'user@user.com',
        password: '1234',
        admin: true
      }
      await request(app).post('/nlw-valoriza/v1/users').send(userData)

      const tokenData = await request(app).post('/nlw-valoriza/v1/login').send({
        email: userData.email,
        password: userData.password
      })

      const response = await request(app).put('/nlw-valoriza/v1/tags').set(
        'Authorization', `Bearer ${tokenData.body.access_token}`
      ).send({
        id: '8f42f366-a220-45a8-b6cb-c7e94b438866',
        name: ''
      })

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Incorrect name!"
      })
    })

    it('should not be able to update a tag sending a name bigger than 25 chars', async () => {
      const userData = {
        name: 'User',
        email: 'user@user.com',
        password: '1234',
        admin: true
      }
      await request(app).post('/nlw-valoriza/v1/users').send(userData)

      const tokenData = await request(app).post('/nlw-valoriza/v1/login').send({
        email: userData.email,
        password: userData.password
      })

      const response = await request(app).put('/nlw-valoriza/v1/tags').set(
        'Authorization', `Bearer ${tokenData.body.access_token}`
      ).send({
        id: '8f42f366-a220-45a8-b6cb-c7e94b438866',
        name: 'ASDFGHJKLASDFGHJKLASDFGHJK'
      })

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Tag name must have a maximum size of 25 chars!"
      })
    })

    it('should not be able to update the name of an inexistent tag', async () => {
      const userData = {
        name: 'User',
        email: 'user@user.com',
        password: '1234',
        admin: true
      }
      await request(app).post('/nlw-valoriza/v1/users').send(userData)

      const tokenData = await request(app).post('/nlw-valoriza/v1/login').send({
        email: userData.email,
        password: userData.password
      })

      const response = await request(app).put('/nlw-valoriza/v1/tags').set(
        'Authorization', `Bearer ${tokenData.body.access_token}`
      ).send({
        id: '8f42f366-a220-45a8-b6cb-c7e94b438866',
        name: 'Optmistic'
      })

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Tag don't exist!"
      })
    })

    it('should be able to update the name of an existing tag, when authenticated with an admin user', async() => {
      const userData = {
        name: 'User',
        email: 'user@user.com',
        password: '1234',
        admin: true
      }
      await request(app).post('/nlw-valoriza/v1/users').send(userData)

      const tokenData = await request(app).post('/nlw-valoriza/v1/login').send({
        email: userData.email,
        password: userData.password
      })

      const createdTag = await request(app).post('/nlw-valoriza/v1/tags').set(
        'Authorization', `Bearer ${tokenData.body.access_token}`
      ).send({
        name: "Optmistic!"
      })

      const response = await request(app).put('/nlw-valoriza/v1/tags').set(
        'Authorization', `Bearer ${tokenData.body.access_token}`
      ).send({
        id: createdTag.body.id,
        name: 'Enthusiast!'
      })

      expect(response.status).toBe(204);
    })
  })

  describe('DELETE /v1/tags/:id', () => {

  })
})