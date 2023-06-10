import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  ObjectId,
  ObjectIdColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';


@Entity()
export class Message {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ length: 250 })
  text: string;

  @CreateDateColumn()
  timeSent: Date;

  @JoinTable()
  @ManyToOne(() => User, (user: User) => user.messages)
  user: User;
}
