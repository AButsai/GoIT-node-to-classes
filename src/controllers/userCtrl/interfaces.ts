import { Request, Response } from 'express'

export interface IUser {
  current(req: Request, res: Response): Promise<void>
  subscription(req: Request, res: Response): Promise<void>
  avatar(req: Request, res: Response): Promise<void>
}
