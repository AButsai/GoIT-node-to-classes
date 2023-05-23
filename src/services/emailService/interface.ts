export interface ISendEmail {
  sendEmail(email: string, verificationToken: string): Promise<boolean>
}

export interface Mail {
  to: string
  from: string
  subject: string
  html: string
}
