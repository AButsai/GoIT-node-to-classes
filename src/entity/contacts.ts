import { BaseEntity, BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ErrorEmailNotValid } from '../errors/ErrorProcessing.js'
import { User } from './user.js'

@Entity()
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ default: '' })
  name!: string

  @Column({ unique: true, default: '' })
  email!: string

  @BeforeInsert()
  validateEmail() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      throw new ErrorEmailNotValid()
    }
  }

  @Column({ default: '' })
  phone!: string

  @Column({ default: false })
  favorite!: boolean

  @ManyToOne('User', 'contacts')
  user!: User
}
