import { Request, Response } from 'express'
import fs from 'fs/promises'
import { MulterError } from 'multer'
import path from 'path'
import { v4 } from 'uuid'
import { ErrorBadRequest, ErrorFileProvided, ErrorMulter, ErrorNotFound } from '../../errors/ErrorProcessing.js'
import { generateTokens } from '../../helpers/jwt.js'
import { photoProcessing } from '../../helpers/photoProcessing.js'
import { UserService } from '../../services/userService/userService.js'
import { getDirname } from '../../utils/utils.js'

export class User {
  private _userService: UserService
  private __dirname: string
  private _avatarDir: string
  constructor(userService: UserService) {
    this._userService = userService
    this.__dirname = getDirname(import.meta.url)
    this._avatarDir = path.join(this.__dirname, '../../', 'public', 'images', 'avatar')
  }

  async current(req: Request, res: Response) {
    const { email } = req.user

    const user = await this._userService.getUser('email', email.toLowerCase().trim())
    if (!user) {
      throw new ErrorNotFound()
    }

    const tokens = await generateTokens(user.email, user.id)

    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 100, httpOnly: true })
    return res.status(200).json({ message: 'success', token: tokens.accessToken, user })
  }

  async subscription(req: Request, res: Response) {
    const { email } = req.user
    const { subscription } = req.body

    const user = await this._userService.getUser('email', email.toLowerCase().trim())
    if (!user) {
      throw new ErrorNotFound()
    }

    const updateUser = await this._userService.updateUser(user.id, { subscription })

    res.status(200).json({ message: 'success', user: updateUser })
  }

  async avatar(req: Request, res: Response) {
    const { email } = req.user
    if (!req.file) {
      throw new ErrorFileProvided()
    }
    const { path: tempUpload, originalname } = req.file

    const user = await this._userService.getUser('email', email.toLowerCase().trim())
    if (!user) {
      throw new ErrorBadRequest()
    }

    const avatarName = `${v4()}_${originalname}`
    const resultPath = path.join(this._avatarDir, avatarName)

    try {
      await photoProcessing(tempUpload, 250)
      await fs.rename(tempUpload, resultPath)
      const avatarURL = path.join('images', 'avatar', avatarName)
      await this._userService.updateUser(user?.id, { avatarURL })
      res.status(200).json({ avatarUrl: avatarURL })
    } catch (error) {
      await fs.unlink(tempUpload)
      if (error instanceof MulterError) {
        throw new ErrorMulter(error.message)
      } else {
        throw new ErrorBadRequest()
      }
    }

    res.status(200).json()
  }
}
