import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Transactions } from "./Transactions";
import { User } from "./User.entity";

@Entity()
export class Accounts {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.account, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Transactions, (transaction) => transaction.account)
  transactions: Transactions[];

  constructor(name: string, user: User, transactions: Transactions[]) {
    this.name = name;
    this.transactions = transactions;
    this.user = user;
  }
}
