import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../../app';
import createConnection from '../../database';

describe('Compliments', () => {

  let userSender;
  let userReceiver;
  let normalTokenResponse;
  let adminTokenResponse;
  let createdTag;

  beforeEach(async() => {
    const connection = await createConnection();

    await connection.runMigrations();

    userSender = await request(app).post('/users').send({
      name: 'User',
      email: 'user@user.com',
      password: '1234',
      admin: true
    })

    userReceiver = await request(app).post('/users').send({
      name: 'Normal',
      email: 'normal@user.com',
      password: '1234'
    })

    adminTokenResponse = await request(app).post('/login').send({
      email: 'user@user.com',
      password: '1234'
    })

    normalTokenResponse = await request(app).post('/login').send({
      email: 'user@user.com',
      password: '1234'
    })

    createdTag = await request(app).post('/tags').set(
      'Authorization', `Bearer ${adminTokenResponse.body}`
    ).send({
      name: 'Optmistic'
    })
  })

  afterEach(async() => {
    const connection = getConnection();

    await connection.dropDatabase();

    await connection.close();
  })

  describe('POST /compliments', () => {
    it('should be able to create a compliment with an authenticated admin user', async () => {
      const response = await request(app).post('/compliments').set(
        'Authorization', `Bearer ${adminTokenResponse.body}`
      ).send({
        tag_id: createdTag.body.id,
        user_receiver: userReceiver.body.id,
        message: 'This is a nice compliment'
      })
  
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.user_sender).toBe(userSender.body.id);
      expect(response.body.user_receiver).toBe(userReceiver.body.id);
      expect(response.body.tag_id).toBe(createdTag.body.id);
      expect(response.body.message).toBe('This is a nice compliment');
      expect(response.body.created_at).toBeDefined();
    })
  
    it('should be able to create a compliment with an authenticated normal user', async () => {
      const response = await request(app).post('/compliments').set(
        'Authorization', `Bearer ${normalTokenResponse.body}`
      ).send({
        tag_id: createdTag.body.id,
        user_receiver: userReceiver.body.id,
        message: 'This is a nice compliment'
      })
  
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.user_sender).toBe(userSender.body.id);
      expect(response.body.user_receiver).toBe(userReceiver.body.id);
      expect(response.body.tag_id).toBe(createdTag.body.id);
      expect(response.body.message).toBe('This is a nice compliment');
      expect(response.body.created_at).toBeDefined();
    })

    it('should not be able to create a compliments without beign logged in', async () => {
      const response = await request(app).post('/compliments').send({
        tag_id: createdTag.body.id,
        user_receiver: userSender.body.id,
        message: 'This is a nice compliment'
      })
  
      expect(response.status).toBe(401);
    })
  
    it('should not be able to create a compliment for the sender user', async () => {
      const response = await request(app).post('/compliments').set(
        'Authorization', `Bearer ${normalTokenResponse.body}`
      ).send({
        tag_id: createdTag.body.id,
        user_receiver: userSender.body.id,
        message: 'This is a nice compliment'
      })
  
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: 'Incorrect User Receiver'
      });
    })
  
    it('should not be able to create a compliment on an inexistent tag', async () => {
      const response = await request(app).post('/compliments').set(
        'Authorization', `Bearer ${normalTokenResponse.body}`
      ).send({
        tag_id: 'inexistent',
        user_receiver: userReceiver.body.id,
        message: 'This is a nice compliment'
      })
  
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: 'Tag does not exists!'
      });
    })
  
    it('should not be able to create a compliment to an inexistent user', async () => {
      const response = await request(app).post('/compliments').set(
        'Authorization', `Bearer ${normalTokenResponse.body}`
      ).send({
        tag_id: createdTag.body.id,
        user_receiver: 'invalid_tag',
        message: 'This is a nice compliment'
      })
  
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: 'User Receiver does not exists!'
      });
    })
  })

  describe('DELETE /compliments/:id', () => {
    it('should not be able to delete a compliment that does not exists', async () => {
      const createdCompliment = await request(app).post('/compliments').set(
        'Authorization', `Bearer ${normalTokenResponse.body}`
      ).send({
        tag_id: createdTag.body.id,
        user_receiver: userReceiver.body.id,
        message: 'This is a nice compliment'
      })

      const response = await request(app).delete(`/compliments/inexistent`).set(
        'Authorization', `Bearer ${normalTokenResponse.body}`
      ).send()
  
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: 'Compliment not found!'
      });
    })

    it('should not be able to delete a compliment without beign logged in', async () => {
      const createdCompliment = await request(app).post('/compliments').set(
        'Authorization', `Bearer ${normalTokenResponse.body}`
      ).send({
        tag_id: createdTag.body.id,
        user_receiver: userReceiver.body.id,
        message: 'This is a nice compliment'
      })

      const response = await request(app).delete(`/compliments/inexistent`).send()
  
      expect(response.status).toBe(401);
    })

    it('should be able to delete a compliment', async () => {
      const createdCompliment = await request(app).post('/compliments').set(
        'Authorization', `Bearer ${normalTokenResponse.body}`
      ).send({
        tag_id: createdTag.body.id,
        user_receiver: userReceiver.body.id,
        message: 'This is a nice compliment'
      })

      const response = await request(app).delete('/compliments/' + createdCompliment.body.id).set(
        'Authorization', `Bearer ${normalTokenResponse.body}`
      ).send()
  
      expect(response.status).toBe(204);
    })
  })
})