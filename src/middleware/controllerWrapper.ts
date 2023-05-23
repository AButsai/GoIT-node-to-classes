import { Request, Response, NextFunction } from "express"

type TControllerWrapper = (req: Request, res: Response) => void

export const controllerWrapper = (ctrl: TControllerWrapper) => {
  const func = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ctrl(req, res)
    } catch (error) {
      next(error)
    }
  }
  return func
}
