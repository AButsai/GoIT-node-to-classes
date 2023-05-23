import { User } from '../../entity/user.js'

export interface IUserService {
  addUser(email: string, hashPass: string, verificationToken: string, avatar: string): Promise<User>
  getUser(field: keyof User, value: string): Promise<User | null>
  updateUser(id: string, body: IUpdateUserDto): Promise<User | null>
}

export interface IUpdateUserDto {
  subscription?: string
  avatarURL?: string
  verify?: boolean
  verificationCode?: string | null
}
