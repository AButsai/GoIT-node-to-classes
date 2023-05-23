import bcrypt from 'bcryptjs'
const { genSaltSync, compareSync } = bcrypt

export const createHashPassport = (password: string) => {
  const hashPassword = bcrypt.hashSync(password, genSaltSync(10))
  return hashPassword
}

export const comparePassword = (password: string, hashPassword: string) => {
  return compareSync(password.trim(), hashPassword)
}
