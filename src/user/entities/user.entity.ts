import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';

import { UserRole } from '../../core/enums/user';
import { UserDto } from '../dtos/user.dto';
import { Claim } from '../../claim/entities/claim.entity';
import { Action } from '../../action/entities/action.entity';
import { AbstractEntity } from '../../core/abstract.entity';
import { IsEmail } from 'class-validator';

@Entity('user')
export class User extends AbstractEntity<UserDto> {
  @ApiProperty()
  @Column({ type: 'varchar', unique: true })
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column({ default: '', nullable: true })
  firstName: string;

  @ApiProperty()
  @Column({ default: '', nullable: true })
  lastName: string;

  @ApiProperty()
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ enum: UserRole })
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;
  userRole: UserRole;

  @ApiProperty()
  @Column({ type: Date, default: 'NOW()' })
  lastLogin: Date;

  @ApiProperty({ type: Boolean, default: null })
  @Column({ type: Boolean, default: false, nullable: true })
  active: boolean;

  @BeforeInsert()
  preProcess() {
    this.email = this.email.toLowerCase();
  }

  @OneToMany(() => Claim, (claim) => claim.user)
  claims: Claim[];

  @OneToMany(() => Action, (action) => action.user)
  actions: Action[];

  toUserDto(): UserDto {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      image: this.image,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLogin: this.lastLogin,
    };
  }
}
