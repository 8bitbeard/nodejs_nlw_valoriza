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

  describe('POST /user', () => {
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

    describe('PUT /users', () => {
      it('should be able to edit the name of an user when authenticated with a admin user', async () => {
        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const normalData = await request(app).post('/users').send({
          name: 'Normal User',
          email: 'normal_user@example.com',
          password: '1234'
        })

        const tokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        const response = await request(app).put('/users').set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send({
          id: normalData.body.id,
          name: 'Normal User Edited'
        })

        expect(response.status).toBe(204);
      })

      it('should be able to edit the email of an user when authenticated with a admin user', async () => {
        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const normalData = await request(app).post('/users').send({
          name: 'Normal User',
          email: 'normal_user@example.com',
          password: '1234'
        })

        const tokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        const response = await request(app).put('/users').set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send({
          id: normalData.body.id,
          email: 'normal_user_edited@example.com'
        })

        expect(response.status).toBe(204);
      })

      it('should be able to edit the admin value of an user when authenticated with a admin user', async () => {
        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const normalData = await request(app).post('/users').send({
          name: 'Normal User',
          email: 'normal_user@example.com',
          password: '1234'
        })

        const tokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        const response = await request(app).put('/users').set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send({
          id: normalData.body.id,
          admin: true
        })

        expect(response.status).toBe(204);
      })

      it('should be able to edit all 3 values of an user when authenticated with a admin user', async () => {
        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const normalData = await request(app).post('/users').send({
          name: 'Normal User',
          email: 'normal_user@example.com',
          password: '1234'
        })

        const tokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        const response = await request(app).put('/users').set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send({
          id: normalData.body.id,
          name: 'Normal User Edited',
          email: 'normal_user_edited@example.com',
          password: '1234',
          admin: true
        })

        expect(response.status).toBe(204);
      })

      it('should not be able to edit an user when authenticated with an normal user', async () => {
        const normalData = await request(app).post('/users').send({
          name: 'Normal User',
          email: 'normal_user@example.com',
          password: '1234'
        })

        const tokenData = await request(app).post('/login').send({
          email: 'normal_user@example.com',
          password: '1234'
        })

        const response = await request(app).put('/users').set(
          'Authorization', `Bearer ${tokenData.body}`
        ).send({
          id: normalData.body.id,
          name: 'Normal User Edited',
          email: 'normal_user_edited@example.com',
          password: '1234',
          admin: true
        })

        expect(response.status).toBe(401);
      })

      it('should not be able to edit an user when not authenticated', async () => {
        const response = await request(app).put('/users').send({
          id: '1234',
          name: 'Normal User Edited',
          email: 'normal_user_edited@example.com',
          password: '1234',
          admin: true
        })

        expect(response.status).toBe(401);
      })

      it('should not be able to edit an inexistent user', async () => {
        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const tokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        const response = await request(app).put('/users').set(
          'Authorization', `Bearer ${tokenData.body}`
        ).send({
          id: '1234',
          name: 'Normal User Edited',
          email: 'normal_user_edited@example.com',
          password: '1234',
          admin: true
        })

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          error: "User don't exist!"
        })
      })

      it('should not be able to edit a user with no changes in the payload', async () => {
        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const normalData = await request(app).post('/users').send({
          name: 'Normal User',
          email: 'normal_user@example.com',
          password: '1234'
        })

        const tokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        const response = await request(app).put('/users').set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send({
          id: normalData.body.id,
          name: 'Normal User',
          email: 'normal_user@example.com',
          admin: false
        })

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          error: "No changes were made!"
        })
      })

      it('should not be able to edit a user without sending name, email or admin data in the payload', async () => {
        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const normalData = await request(app).post('/users').send({
          name: 'Normal User',
          email: 'normal_user@example.com',
          password: '1234'
        })

        const tokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        const response = await request(app).put('/users').set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send({
          id: normalData.body.id,
        })

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          error: "No changes were made!"
        })
      })
    })

    describe('GET /users', () => {
      it('should be able to list all the users when requesting without filters and authenticated', async () => {
        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const tokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        const response = await request(app).get('/users').set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send()

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0].id).toBeDefined();
        expect(response.body[0].name).toBeDefined();
        expect(response.body[0].email).toBeDefined();
        expect(response.body[0].admin).toBeDefined();
        expect(response.body[0].created_at).toBeDefined();
        expect(response.body[0].updated_at).toBeDefined();
      })

      it('should be able to list the users with filtered name when authenticated', async () => {
        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const tokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        const response = await request(app).get('/users').set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send({
          name: 'Admin User'
        })

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0].id).toBeDefined();
        expect(response.body[0].name).toBeDefined();
        expect(response.body[0].email).toBeDefined();
        expect(response.body[0].admin).toBeDefined();
        expect(response.body[0].created_at).toBeDefined();
        expect(response.body[0].updated_at).toBeDefined();
      })

      it('should be able to list the users with filtered email when authenticated', async () => {
        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const tokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        const response = await request(app).get('/users').set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send({
          email: 'admin_user@example.com'
        })

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0].id).toBeDefined();
        expect(response.body[0].name).toBeDefined();
        expect(response.body[0].email).toBeDefined();
        expect(response.body[0].admin).toBeDefined();
        expect(response.body[0].created_at).toBeDefined();
        expect(response.body[0].updated_at).toBeDefined();
      })

      it('should not be able to list users when not authenticated', async () => {
        const response = await request(app).get('/users').send()

        expect(response.status).toBe(401)
      })
    })

    describe('GET /users/:id', () => {
      it('should be able to return the user data when authenticated', async () => {
        const userData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234'
        })

        const tokenData = await request(app).post('/login').send({
          email: userData.body.email,
          password: '1234'
        })

        const response = await request(app).get('/users/' + userData.body.id).set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send()

        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBeDefined();
        expect(response.body.email).toBeDefined();
        expect(response.body.admin).toBeDefined();
        expect(response.body.created_at).toBeDefined();
        expect(response.body.updated_at).toBeDefined();
      })

      it('should not be able to return the data of an inexistent user when authenticated', async () => {
        const userData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234'
        })

        const tokenData = await request(app).post('/login').send({
          email: userData.body.email,
          password: '1234'
        })

        const response = await request(app).get('/users/1234').set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send()

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          error: 'User not found!'
        })

      })

      it('should not be able to return the user data when not authenticated', async () => {
        const response = await request(app).get('/users/1234').send()

        expect(response.status).toBe(401);
      })
    })

    describe('DELETE /users/:id', () => {
      it('should be able to delete a user when authenticated with and admin user', async () => {
        const userData = await request(app).post('/users').send({
          name: 'Normal User',
          email: 'normal_user@example.com',
          password: '1234'
        })

        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const tokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        const response = await request(app).delete('/users/' + userData.body.id).set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send()

        expect(response.status).toBe(204);
      })

      it('should not be able to delete a user when authenticated with an normal user', async () => {
        const userData = await request(app).post('/users').send({
          name: 'Normal User',
          email: 'normal_user@example.com',
          password: '1234'
        })

        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const tokenData = await request(app).post('/login').send({
          email: userData.body.email,
          password: '1234'
        })

        const response = await request(app).delete('/users/' + adminData.body.id).set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send()

        expect(response.status).toBe(401);
      })

      it('should not be able to delete a inexistent user when authenticated with an admin user', async () => {
        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const tokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        const response = await request(app).delete('/users/1234').set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send()

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          error: "User does not exist!"
        })
      })

      it('should not be able to delete the same user that is authenticated', async () => {
        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const tokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        const response = await request(app).delete('/users/' + adminData.body.id).set(
          'Authorization',  `Bearer ${tokenData.body}`
        ).send()

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          error: "An user can't delete himself!"
        })
      })

      it('should not be able to delete an user without beign authenticated', async () => {
        const adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        const response = await request(app).delete('/users/' + adminData.body.id).send()

        expect(response.status).toBe(401);
      })
    })

    describe('PATCH /users/password', () => {
      let adminData: request.Response;
      let normalData: request.Response;
      let adminTokenData: request.Response;
      let normalTokenData: request.Response;

      beforeEach(async() => {
        adminData = await request(app).post('/users').send({
          name: 'Admin User',
          email: 'admin_user@example.com',
          password: '1234',
          admin: true
        })

        normalData = await request(app).post('/users').send({
          name: 'Normal User',
          email: 'normal_user@example.com',
          password: '1234'
        })

        adminTokenData = await request(app).post('/login').send({
          email: adminData.body.email,
          password: '1234'
        })

        normalTokenData = await request(app).post('/login').send({
          email: normalData.body.email,
          password: '1234'
        })
      })

      it('should be able to update the authenticated admin user password', async () => {
        const response = await request(app).patch('/users/password').set(
          'Authorization', `Bearer ${adminTokenData.body}`
        ).send({
          password: '2345'
        })

        expect(response.status).toBe(200);
      })

      it('should be able to update the authenticated normal user password', async () => {
        const response = await request(app).patch('/users/password').set(
          'Authorization', `Bearer ${normalTokenData.body}`
        ).send({
          password: '2345'
        })

        expect(response.status).toBe(200);
      })

      it('should not be able to update the authenticated user password , with a password that contains anything besides numbers', async () => {
        const response = await request(app).patch('/users/password').set(
          'Authorization', `Bearer ${adminTokenData.body}`
        ).send({
          password: 'a$45'
        })

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          error: 'Password must contain only numbers!'
        })
      })

      it('should not be able to update the authenticated user password, with a password bigger than 4 digits', async () => {
        const response = await request(app).patch('/users/password').set(
          'Authorization', `Bearer ${adminTokenData.body}`
        ).send({
          password: '12345'
        })

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          error: 'Password size must be equal to 4!'
        })

      })

      it('should not be able to update the authenticated user password, with a password smaller than 4 digits', async () => {
        const response = await request(app).patch('/users/password').set(
          'Authorization', `Bearer ${adminTokenData.body}`
        ).send({
          password: '123'
        })

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          error: 'Password size must be equal to 4!'
        })
      })
    })
  })
})
