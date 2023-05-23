export interface IUser {
  email: string
  password: string
}

export interface IContact {
  name: string
  email: string
  phone: string
}

export interface IVerifyEmail {
  verificationCode: number
}

export interface IResendingEmail {
  email: string
}

export interface IUpdateSubscription {
  subscription: string
}

export interface IUpdateStatusContact {
  favorite?: boolean
}
