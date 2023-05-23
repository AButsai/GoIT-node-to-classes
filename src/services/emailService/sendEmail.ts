import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'
import { ErrorEmailNotValid, ErrorEmailSend } from '../../errors/ErrorProcessing.js'
import { Mail } from './interface.js'
dotenv.config()
const { SENDGRID_API_KEY, FROM_EMAIL, BASE_URL } = process.env
sgMail.setApiKey(`SG.${SENDGRID_API_KEY}`)

export class SendEmail {
  private isValidEmail(email: string) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ErrorEmailNotValid()
    }
  }

  async sendEmail(email: string, verificationToken: string) {
    this.isValidEmail(email)

    const mail: Mail = {
      to: email,
      from: FROM_EMAIL as string,
      subject: 'Confirm email',
      html: `<p>Please confirm your email to start using all the resources of the service <a href='http://${BASE_URL}/api/users/verify/${verificationToken}' target='_blank'>Confirm email</a></p>`,
    }

    try {
      await sgMail.send(mail)
      return true
    } catch (error) {
      console.log(error)
      throw new ErrorEmailSend()
    }
  }
}
