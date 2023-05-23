import { Request, Response } from 'express'
import { ErrorNotFound } from '../../errors/ErrorProcessing.js'
import { ContactService } from '../../services/contactsService/contactsService.js'
import { IBodyUpdate } from '../../services/contactsService/interfaces.js'
import { UserService } from '../../services/userService/userService.js'
import { IContacts } from './interfaces.js'

export class Contacts implements IContacts {
  private _contactsService: ContactService
  private _userService: UserService
  constructor(contactService: ContactService, userService: UserService) {
    this._contactsService = contactService
    this._userService = userService
  }

  private async getContact(id: string) {
    const contact = await this._contactsService.getByIdContact(id)
    if (!contact) {
      throw new ErrorNotFound()
    }
    return contact
  }

  private async updateContactById(id: string, body: IBodyUpdate) {
    return await this._contactsService.updateContact(id, { ...body })
  }

  private async getUser(value: string) {
    const user = await this._userService.getUser('email', value)
    if (!user) {
      throw new ErrorNotFound()
    }
    return user
  }

  async addContact(req: Request, res: Response) {
    const { email: userEmail } = req.user
    const { name, email, phone } = req.body

    const user = await this.getUser(userEmail.toLowerCase().trim())

    const newContact = await this._contactsService.addContact(user, { name, email, phone })

    res.status(200).json({ contact: newContact })
  }

  async deleteContact(req: Request, res: Response) {
    const { contactId } = req.params
    await this.getContact(contactId)
    await this._contactsService.deleteContact(contactId)
    res.status(200).json({ message: 'delete contact' })
  }

  async getAllContact(req: Request, res: Response) {
    const { email } = req.user
    const { favorite = false } = req.query
    let page = parseInt(req.query.page as string, 10)
    let limit = parseInt(req.query.limit as string, 10)

    if (isNaN(page) || (page === undefined && isNaN(limit)) || limit === undefined) {
      page = 0
      limit = 10
    }
    const user = await this.getUser(email.toLowerCase().trim())

    const allContacts = await this._contactsService.getAllContacts(user.id, page, limit)

    if (favorite === 'true') {
      const contacts = [...allContacts].filter((contact) => contact.favorite === !!favorite)
      res.status(200).json({ contacts, page, limit })
      return
    }
    res.status(200).json({ contacts: allContacts, page, limit })
  }

  async getContactById(req: Request, res: Response) {
    const { contactId } = req.params

    const contact = await this.getContact(contactId)

    res.status(200).json({ contact })
  }

  async updateContact(req: Request, res: Response) {
    const { contactId } = req.params

    await this.getContact(contactId)

    const updateContact = await this.updateContactById(contactId, req.body)
    res.status(200).json({ contact: updateContact })
  }

  async updateStatusContact(req: Request, res: Response) {
    const { contactId } = req.params
    const { favorite } = req.body
    await this.getContact(contactId)

    const updateContact = await this.updateContactById(contactId, { favorite })
    res.status(200).json({ contact: updateContact })
  }
}
