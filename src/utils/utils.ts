import path from "path"
import { fileURLToPath } from "url"

type TFuncString = (str: string) => string

export const getFilename: TFuncString = (metaUrl: string): string => {
  const __filename = fileURLToPath(metaUrl)
  return __filename
}

export const getDirname: TFuncString = (metaUrl: string): string => {
  const __dirname = path.dirname(getFilename(metaUrl))
  return __dirname
}