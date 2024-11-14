import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transacitons } from "./Transactions";
import { Accounts } from "./Accounts";
import { Category } from "./Category";
import { RefreshToken } from "./RefreshToken";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number; // Using the definite assignment assertion

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Transacitons, (transaction) => transaction.user)
  transactions: Transacitons[];

  @OneToMany(() => Accounts, (account) => account.user)
  account: Accounts[];

  @OneToMany(() => Category, (category) => category.user)
  category: Category[];

  @OneToMany(() => RefreshToken, (refresh) => refresh.user)
  refresh_token: RefreshToken[];

  constructor(
    username: string,
    password: string,
    transactions: Transacitons[],
    account: Accounts[],
    category: Category[],
    refresh_token: RefreshToken[]
  ) {
    this.username = username;
    this.password = password;
    this.transactions = transactions;
    this.account = account;
    this.category = category;
    this.refresh_token = refresh_token;
  }
}
