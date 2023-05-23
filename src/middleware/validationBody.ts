import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

import { ErrorValidSchemaJoi } from '../errors/ErrorProcessing.js'

type TValidationBody = (req: Request, res: Response, next: NextFunction) => unknown | Promise<void>
type TValidationFunction<T> = (data: T) => Joi.ValidationResult<T>

export const validationBody = <T>(schema: TValidationFunction<T>): TValidationBody => {
  const func: TValidationBody = async (req: Request, res: Response, next: NextFunction) => {
    const valid = schema(req.body)
    if (valid.error) {
      next(new ErrorValidSchemaJoi(valid.error.message))
      return
    }
    next()
  }
  return func
}
