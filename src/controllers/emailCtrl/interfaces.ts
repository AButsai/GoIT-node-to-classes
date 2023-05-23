import { Request, Response } from 'express'

export interface IEmail {
  verifyEmail(req: Request, res: Response): Promise<void>
  resendingEmail(req: Request, res: Response): Promise<void>
}
