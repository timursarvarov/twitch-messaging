
import {
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn,
  OneToMany,
  Unique
} from 'typeorm';
import { Message } from '../../chat/entities/message.entity';

@Entity()
export class User {

  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ length: 20 })
  username: string;

  @Column({ length: 20 })
  @Unique(['email'])
  email: string;

  @Column({ length: 60 })
  password: string;

  @OneToMany(() => Message, (message: Message) => message.user)
  messages: Array<Message>;

}
