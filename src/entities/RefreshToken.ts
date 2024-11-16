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

  @Column()
  os: string;

  @Column()
  browser: string;

  @ManyToOne(() => User, (user) => user.account, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  constructor(
    token: string,
    status: boolean,
    os: string,
    browser: string,
    user: User
  ) {
    this.token = token;
    this.user = user;
    this.status = status;
    this.os = os;
    this.browser = browser;
  }
}
