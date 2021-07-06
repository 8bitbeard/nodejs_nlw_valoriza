import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from "../database";

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

  it('should be able to create a new admin user', async () => {
    const response = await request(app).post('/users').send({
      name: 'User',
      email: 'user@example.com',
      password: '1234',
      admin: true
    })

    expect(response.status).toBe(201);
  })

  it('should be able to create a normal user', async () => {
    const response = await request(app).post('/users').send({
      name: "User",
      email: 'user@example.com',
      password: '1234',
      admin: false
    })

    expect(response.status).toBe(201);
  })

  it('should be able to create a user without the admin parameter', async () => {
    const response = await request(app).post('/users').send({
      name: 'User',
      email: 'user@example.com',
      password: '1234'
    })

    expect(response.status).toBe(201);
  })

  it('should not be able to create a user without the email parameter', async () => {
    const response = await request(app).post('/users').send({
      name: 'User',
      password: '1234',
      admin: false
    })

    expect(response.status).toBe(400);
  })

  it('should not be able to create a user without the password parameter', async () => {
    const response = await request(app).post('/users').send({
      name: 'User',
      email: 'user@example.com',
      admin: false
    })

    expect(response.status).toBe(400);
  })

  it('should not be able to create a user with an existing email', async () => {
    const payload = {
      name: 'User',
      email: 'user@example.com',
      password: '1234',
      admin: false
    }
    await request(app).post('/users').send(payload)

    const response = await request(app).post('/users').send(payload)

    expect(response.status).toBe(400);
  })

  it('should not be able to create a user with a password with letters or special characters', async () => {
    const response = await request(app).post('/users').send({
      name: 'User',
      email: 'user@example.com',
      password: 'Abc123$%',
      admin: false
    })

    expect(response.status).toBe(400);
  })

  it('should not be able to create a user with a password that has more than 4 digits', async () => {
    const response = await request(app).post('/users').send({
      name: 'User',
      email: 'user@example.com',
      password: '12345',
      admin: false
    })

    expect(response.status).toBe(400);
  })

  it('should not be able to create a user with a password that has less than 4 digits', async () => {
    const response = await request(app).post('/users').send({
      name: 'User',
      email: 'user@example.com',
      password: '123',
      admin: false
    })

    expect(response.status).toBe(400);
  })
})