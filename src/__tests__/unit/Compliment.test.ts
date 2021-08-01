import { createConnection, getConnection, Entity, getRepository } from "typeorm";
import { Compliment } from "../../entities/Compliment";
// import { User } from "../../entities/User";
import { Tag } from "../../entities/Tag";

beforeEach(() => {
  return createConnection({
    type: 'sqlite',
    database: ":memory:",
    dropSchema: true,
    entities: [Compliment, Tag],
    synchronize: true,
    logging: false
  });
});

afterEach(() => {
  let conn = getConnection();
  return conn.close();
})

describe('Compliment', () => {
  it('store a compliment and fetch it', async() => {
    let createTag = getRepository(Tag).create({
      name: 'Optmistic',
    });
    let tagData = await getRepository(Tag).save(createTag);

    let complimentData = getRepository(Compliment).create({
      user_sender: 'Optmistic',
      user_receiver: 'Test',
      tag_id: tagData.id,
      message: '1234'
    });
    const compliment = await getRepository(Compliment).save(complimentData);
    let createdcompliment = await getRepository(Compliment).findOne({
      where: {
        id: compliment.id
      }
    });
    expect(createdcompliment.message).toBe('1234')
  })
})