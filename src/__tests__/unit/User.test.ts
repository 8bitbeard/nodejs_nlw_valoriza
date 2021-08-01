import { createConnection, getConnection, Entity, getRepository } from "typeorm";
import { User } from "../../entities/User";

beforeEach(() => {
  return createConnection({
    type: 'sqlite',
    database: ":memory:",
    dropSchema: true,
    entities: [User],
    synchronize: true,
    logging: false
  });
});

afterEach(() => {
  let conn = getConnection();
  return conn.close();
})

describe('User', () => {
  it('store a user and fetch it', async() => {
    let createUser = getRepository(User).create({
      name: 'John Doe',
      email: 'jhondoe@email.com',
      admin: true,
      password: '1234'
    });
    await getRepository(User).save(createUser);
    let user = await getRepository(User).find({
      where: {
        name: 'John Doe'
      }
    });
    expect(user[0].name).toBe("John Doe")
  })
})