import dotenv from 'dotenv'
dotenv.config()

interface TokenConfig {
  secretAccess: string
  secretRefresh: string
  tokens: {
    access: {
      type: string
      expiresIn: string
    }
    refresh: {
      type: string
      expiresIn: string
    }
  }
}

const { ACCESS_TOKEN_PRIVATE_KEY, REFRESH_TOKEN_PRIVATE_KEY } = process.env

export const jwtConfig: TokenConfig = {
  secretAccess: ACCESS_TOKEN_PRIVATE_KEY as string,
  secretRefresh: REFRESH_TOKEN_PRIVATE_KEY as string,
  tokens: {
    access: {
      type: 'access',
      expiresIn: '25m',
    },
    refresh: {
      type: 'refresh',
      expiresIn: '30d',
    },
  },
}
