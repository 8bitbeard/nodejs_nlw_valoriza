import { getCustomRepository, Repository } from "typeorm"
import { Compliment } from "../entities/Compliment";
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories";
import { TagsRepositories } from "../repositories/TagsRepositories";
import { UsersRepositories } from "../repositories/UsersRepositories";

interface IComplimentRequest {
    tag_id: string;
    user_sender: string;
    user_receiver: string;
    message: string;
}

class ComplimentsService {

    private complimentsRepositories: Repository<Compliment>

    constructor() {
        this.complimentsRepositories = getCustomRepository(ComplimentsRepositories)
    }

    async searchBySender(user_id: string) {
        const compliments = await this.complimentsRepositories.find({
          // where: {
          //   user_sender: user_id,
          // },
          // relations: ["userSender", "userReceiver", "tag"]
          user_sender: user_id
        })

        return compliments
    }

    async searchByReceiver(user_id: string) {
      const compliments = await this.complimentsRepositories.find({
        user_receiver: user_id
      })

      return compliments
  }

    async create({ tag_id, user_sender, user_receiver, message }: IComplimentRequest) {
        const usersRepositories = getCustomRepository(UsersRepositories);
        const tagsRepositories = getCustomRepository(TagsRepositories);

        if(user_sender == user_receiver) {
          throw new Error("Incorrect User Receiver");
        }

        const tagExists = await tagsRepositories.findOne(tag_id);

        if(!tagExists) {
          throw new Error("Tag does not exists!")
        }

        const userReceiverExists = await usersRepositories.findOne(user_receiver)

        if(!userReceiverExists) {
          throw new Error("User Receiver does not exists!");
        }

        const compliment = this.complimentsRepositories.create({
          tag_id,
          user_receiver,
          user_sender,
          message
        });

        await this.complimentsRepositories.save(compliment);

        return compliment;
    }

    async updateMessage(user_id: string, compliment_id: string, message: string) {
      const compliment = await this.complimentsRepositories.findOne({
        id: compliment_id
      })

      if(!compliment) {
        throw new Error("Compliment not found!")
      }

      if(compliment.user_sender != user_id) {
        throw new Error("Only the compliment owner can change its message!")
      }

      if(!message) {
        throw new Error("The informed message is invalid")
      }

      await this.complimentsRepositories.save({
        id: compliment_id,
        message: message
       });
    }

    async remove(user_sender: string, compliment_id: string) {
    const compliment = await this.complimentsRepositories.findOne({
        id: compliment_id,
        user_sender
      })

      if(!compliment) {
        throw new Error("Compliment not found!");
      }

      const deleteFlag = await this.complimentsRepositories.delete({
        id: compliment_id
      })

      return deleteFlag
    }

}

export { ComplimentsService }