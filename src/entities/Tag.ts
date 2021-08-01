import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { v4 as uuid } from "uuid";
import { Expose } from "class-transformer";
import { Compliment } from "./Compliment"

@Entity("tags")
class Tag {

  @PrimaryColumn()
  readonly id: string;

  @OneToMany(() => Compliment, (compliment) => compliment.id, { cascade: true })
  compliment: Compliment[];

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({name: "name_custom"})
  nameCustom(): string {
    return `#${this.name}`
  }

  constructor() {
    if(!this.id) {
      this.id = uuid();
    }
  }

}

export { Tag };
