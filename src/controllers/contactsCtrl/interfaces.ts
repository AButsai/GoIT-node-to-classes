import { Request, Response } from 'express'

export interface IContacts {
  addContact(req: Request, res: Response): Promise<void>
  deleteContact(req: Request, res: Response): Promise<void>
  getAllContact(req: Request, res: Response): Promise<void>
  getContactById(req: Request, res: Response): Promise<void>
  updateContact(req: Request, res: Response): Promise<void>
  updateStatusContact(req: Request, res: Response): Promise<void>
}
