import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, NextFunction, Request, Response } from 'express'
import path from 'path'
import 'reflect-metadata'

import { AppDataSource } from './data-source.js'
import { RequestError } from './errors/ErrorProcessing.js'
import { getDirname } from './utils/utils.js'

import authRouter from './routes/api/authRouter.js'
import contactsRouter from './routes/api/contactsRouter.js'
import userRouter from './routes/api/userRouter.js'

dotenv.config()

const { PORT = 3001, DB_HOST } = process.env
const app: Express = express()
const __dirname = getDirname(import.meta.url)

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/contacts', contactsRouter)

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err: { status: number; message: string }, req: Request, res: Response, next: NextFunction) => {
  console.log('err', err)
  if (err instanceof RequestError) {
    const { status, message } = err
    return res.status(status).json({ message })
  }
  res.status(500).json({ message: 'Server error' })
})

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.info(`[server]: Server is running at ${PORT}`)
    })
  })
  .catch((err) => console.log(`Server not running. Error message: ${err.message}`))
