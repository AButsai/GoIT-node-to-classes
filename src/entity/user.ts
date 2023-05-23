import { BaseEntity, BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ErrorEmailNotValid } from '../errors/ErrorProcessing.js'
import { Contact } from './contacts.js'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ default: '' })
  password!: string

  @Column({ unique: true, default: '' })
  email!: string

  @BeforeInsert()
  validateEmail() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      throw new ErrorEmailNotValid()
    }
  }

  @Column({ type: 'enum', enum: ['starter', 'pro', 'business'], default: 'starter' })
  subscription!: string

  @Column({ default: '' })
  avatarURL!: string

  @Column({ default: false })
  verify!: boolean

  @Column({ default: '' })
  verificationToken!: string

  @OneToMany('Contact', 'user')
  contacts!: Contact[]
}
