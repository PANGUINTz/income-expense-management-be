import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  token: string;

  @Column()
  status: boolean;

  @ManyToOne(() => User, (user) => user.account, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  constructor(token: string, status: boolean, user: User) {
    this.token = token;
    this.user = user;
    this.status = status;
  }
}
