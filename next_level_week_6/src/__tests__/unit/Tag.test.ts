import { createConnection, getConnection, Entity, getRepository } from "typeorm";
import { Tag } from "../../entities/Tag";
import { classToPlain } from "class-transformer";


beforeEach(() => {
  return createConnection({
    type: 'sqlite',
    database: ":memory:",
    dropSchema: true,
    entities: [Tag],
    synchronize: true,
    logging: false
  });
});

afterEach(() => {
  let conn = getConnection();
  return conn.close();
})

describe('Tag', () => {
  it('store a tag and fetch it', async() => {
    let createTag = getRepository(Tag).create({
      name: 'Optmistic',
    });
    await getRepository(Tag).save(createTag);
    let tag = await getRepository(Tag).findOne({
      where: {
        name: 'Optmistic'
      }
    });
    let converted = classToPlain(tag)

    expect(converted.name).toBe("Optmistic")
  })
})