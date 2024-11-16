import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { TypeCategory } from "../commons/type.enum";
import { User } from "./User.entity";
import { Transactions } from "./Transactions";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: TypeCategory,
  })
  type: TypeCategory;

  @Column({
    default: false,
  })
  is_public: boolean;

  @ManyToOne(() => User, (user) => user.category, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Transactions, (transaction) => transaction.category)
  @JoinColumn({ name: "transactions" })
  transactions: Transactions[];

  constructor(
    name: string,
    type: TypeCategory,
    is_public: boolean,
    user: User,
    transactions: Transactions[]
  ) {
    this.name = name;
    this.type = type;
    this.is_public = is_public;
    this.user = user;
    this.transactions = transactions;
  }
}
