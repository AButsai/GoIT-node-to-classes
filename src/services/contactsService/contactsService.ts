import { Repository } from 'typeorm'
import { AppDataSource } from '../../data-source.js'
import { Contact } from '../../entity/contacts.js'
import { User } from '../../entity/user.js'
import { IBody, IBodyUpdate, IContactService } from './interfaces.js'

export class ContactService implements IContactService {
  private _service: Repository<Contact>
  private _user: Repository<User>

  constructor() {
    this._service = AppDataSource.getRepository(Contact)
    this._user = AppDataSource.getRepository(User)
  }

  async addContact(user: User, { name, email, phone }: IBody) {
    const contact = new Contact()
    contact.name = name
    contact.email = email
    contact.phone = phone
    contact.user = this._user.getId(user)
    await this._service.manager.save(contact)
    return contact
  }

  async updateContact(id: string, body: IBodyUpdate) {
    await this._service.update(id, { ...body })
    return this._service.findOne({ where: { id } })
  }

  async getByIdContact(id: string) {
    return await this._service.findOne({ where: { id } })
  }

  async getAllContacts(userId: string, page: number, limit: number) {
    return this._service.find({ where: { user: { id: userId } }, skip: page, take: limit })
  }

  async deleteContact(id: string) {
    return await this._service.delete(id)
  }
}
