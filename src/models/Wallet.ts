import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    // Gold balance in grams
    @Column({
        type: "decimal",
        precision: 18,
        scale: 6,
        default: 0
    })
    goldBalance!: string;

    // Fiat balance in EUR
    @Column({
        type: "decimal",
        precision: 18,
        scale: 2,
        default: 0
    })
    fiatBalance!: string;

    @OneToOne(() => User, user => user.wallet)
    @JoinColumn({ name: "userId" }) // ensures the foreign key is in this table
    user!: User;
}