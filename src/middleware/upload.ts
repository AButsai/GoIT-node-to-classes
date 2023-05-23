import { Request } from 'express'
import multer from 'multer'
import path from 'path'
import { getDirname } from '../utils/utils.js'

const __dirname = getDirname(import.meta.url)

const uploadDir = path.join(__dirname, '../', 'temp')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type.'))
  }
}

export const upload = multer({ storage: storage, fileFilter: fileFilter })
