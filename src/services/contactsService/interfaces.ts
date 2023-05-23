import { DeleteResult } from 'typeorm'
import { Contact } from '../../entity/contacts.js'
import { User } from '../../entity/user.js'

export interface IContactService {
  addContact(user: User, { name, email, phone }: IBody): Promise<Contact>
  updateContact(id: string, body: IBodyUpdate): Promise<Contact | null>
  getByIdContact(id: string): Promise<Contact | null>
  getAllContacts(userId: string, page: number, limit: number): Promise<Contact[]>
  deleteContact(id: string): Promise<DeleteResult>
}

export interface IBody {
  name: string
  email: string
  phone: string
}

export interface IBodyUpdate extends Partial<IBody> {
  favorite?: boolean
}
