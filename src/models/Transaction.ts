import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
    Index,
} from "typeorm";
import { User } from "./User";
import { Wallet } from "./Wallet";

export type TransactionType = "BUY" | "SELL";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    @Index() // for quick lookup by user
    userId!: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: User;

    @Column({ type: "uuid" })
    walletId!: string;

    @ManyToOne(() => Wallet, { onDelete: "CASCADE" })
    @JoinColumn({ name: "walletId" })
    wallet!: Wallet;

    @Column({ type: "enum", enum: ["BUY", "SELL"] })
    type!: TransactionType;

    @Column({ type: "decimal", precision: 12, scale: 4 })
    amountEUR!: number;

    @Column({ type: "decimal", precision: 12, scale: 4 })
    goldAmount!: number;

    @Column({ type: "decimal", precision: 12, scale: 4 })
    goldPrice!: number;

    @Column({ type: "varchar", nullable: true })
    idempotencyKey?: string | null;

    @CreateDateColumn()
    createdAt!: Date;
}