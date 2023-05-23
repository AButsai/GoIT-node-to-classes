import { Request, Response } from 'express'
import gravatar from 'gravatar'
import { v4 } from 'uuid'
import { ErrorEmailExist, ErrorEmailNotVerified, ErrorLogin, ErrorUnauthorized } from '../../errors/ErrorProcessing.js'
import { comparePassword, createHashPassport } from '../../helpers/bcrypt.js'
import { generateTokens } from '../../helpers/jwt.js'
import { SendEmail } from '../../services/emailService/sendEmail.js'
import { UserService } from '../../services/userService/userService.js'
import { IAuthentication } from './interfaces.js'

export class Authentication implements IAuthentication {
  private _services: UserService
  private _sendEmail: SendEmail
  constructor(services: UserService, sendEmail: SendEmail) {
    this._services = services
    this._sendEmail = sendEmail
  }

  async register(req: Request, res: Response) {
    const { email, password } = req.body
    const candidate = await this._services.getUser('email', email.toLowerCase().trim())
    if (candidate) {
      throw new ErrorEmailExist()
    }

    const verificationToken = v4()
    const isSendEmail = await this._sendEmail.sendEmail(email, verificationToken)

    if (isSendEmail) {
      const hashPass = createHashPassport(password)
      const gravatarUrl: string = gravatar.url(email.trim(), { s: '200', r: 'g', d: 'identicon' })
      const newUser = await this._services.addUser(email.toLowerCase().trim(), hashPass, verificationToken, gravatarUrl)
      const tokens = await generateTokens(newUser.email, newUser.id)

      res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 100, httpOnly: true })
      res.status(200).json({ message: 'success', token: tokens.accessToken })
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body

    const candidate = await this._services.getUser('email', email.toLowerCase().trim())
    if (!candidate || !comparePassword(password, candidate.password)) {
      throw new ErrorLogin()
    }
    if (!candidate.verify) {
      throw new ErrorEmailNotVerified()
    }

    const tokens = await generateTokens(candidate.email, candidate.id)
    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 100, httpOnly: true })
    res.status(200).json({ message: 'success', token: tokens.accessToken })
  }

  async logout(req: Request, res: Response) {
    const { email } = req.user

    const candidate = await this._services.getUser('email', email.toLowerCase().trim())
    if (!candidate) {
      throw new ErrorUnauthorized()
    }

    res.clearCookie('refreshToken')
    res.status(204).json({ message: 'Disconnect...' })
  }

  async refresh(req: Request, res: Response) {
    const { email, id } = req.user

    const tokens = await generateTokens(email, id)
    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 100, httpOnly: true })
    res.status(200).json({ message: 'success', token: tokens.accessToken })
  }
}
