import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Accounts } from "./Accounts";
import { User } from "./User.entity";
import { Category } from "./Category";

@Entity()
export class Transacitons {
  @PrimaryGeneratedColumn()
  id!: number; // Using the definite assignment assertion

  @Column()
  cost: number;

  @Column()
  note: string;

  @Column()
  annual: string;

  @Column()
  monthly: string;

  @Column()
  file_path: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Accounts, (account) => account.transactions, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "account_id" })
  account: Accounts;

  @ManyToOne(() => User, (user) => user.transactions, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Category, (category) => category.transactions, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category: Category;

  constructor(
    cost: number,
    note: string,
    account: Accounts,
    user: User,
    annual: string,
    monthly: string,
    category: Category,
    createdAt: Date,
    updatedAt: Date,
    file_path: string
  ) {
    this.cost = cost;
    this.note = note;
    this.account = account;
    this.user = user;
    this.annual = annual;
    this.monthly = monthly;
    this.file_path = file_path;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.category = category;
  }
}
