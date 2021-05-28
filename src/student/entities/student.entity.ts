import { BeforeInsert, Column, Entity } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { AbstractEntity } from "../../core/abstract.entity";

@Entity('student')
export class Student extends AbstractEntity {
    @Column({ type: 'varchar' })
    firstName: string;
    
    @Column({ type: 'varchar' })
    lastName: string;

    @Column({ type: 'text' })
    email: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'text' })
    salt: string;

    @Column({ type: 'text', nullable: true})
    mobileNumber: string;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
      }
}