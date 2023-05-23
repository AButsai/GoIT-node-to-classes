import { Request, Response } from 'express'
import {
  ErrorBadRequest,
  ErrorConfirmCode,
  ErrorNotFound,
  ErrorVerificationCodePassed,
} from '../../errors/ErrorProcessing.js'
import { generateTokens } from '../../helpers/jwt.js'
import { SendEmail } from '../../services/emailService/sendEmail.js'
import { UserService } from '../../services/userService/userService.js'
import { IEmail } from './interfaces.js'

export class Email implements IEmail {
  private _userService: UserService
  private _sendEmail: SendEmail
  constructor(userService: UserService, sendEmail: SendEmail) {
    this._userService = userService
    this._sendEmail = sendEmail
  }

  async verifyEmail(req: Request, res: Response) {
    const { verificationToken } = req.body

    const candidate = await this._userService.getUser('verificationToken', verificationToken)
    if (!candidate) {
      throw new ErrorBadRequest()
    }
    if (candidate.verificationToken !== verificationToken) {
      throw new ErrorConfirmCode()
    }
    const updatedUser = await this._userService.updateUser(candidate.id, { verify: true, verificationCode: null })
    if (!updatedUser) {
      throw new ErrorNotFound()
    }
    const tokens = await generateTokens(updatedUser.email, updatedUser.id)

    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 100, httpOnly: true })
    res.status(200).json({ message: 'success', token: tokens.accessToken })
  }

  async resendingEmail(req: Request, res: Response) {
    const { email } = req.body
    const candidate = await this._userService.getUser('email', email.toLowerCase().trim())
    if (candidate?.verificationToken === null) {
      throw new ErrorVerificationCodePassed()
    }

    await this._sendEmail.sendEmail(email, candidate?.verificationToken as string)
    res.status(200).json({ message: 'success' })
  }
}
