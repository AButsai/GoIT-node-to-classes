import Joi from 'joi'
import {
  IContact,
  IResendingEmail,
  IUpdateStatusContact,
  IUpdateSubscription,
  IUser,
  IVerifyEmail,
} from './interfaces.js'

export const authenticationJoiSchema = (data: IUser) => {
  const schema = Joi.object<IUser>({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  })
  return schema.validate(data)
}

export const contactJoiSchema = (data: IContact) => {
  const schema = Joi.object<IContact>({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  })
  return schema.validate(data)
}

export const verifyEmailJoi = (data: IVerifyEmail) => {
  const schema = Joi.object<IVerifyEmail>({
    verificationCode: Joi.number().required(),
  })
  return schema.validate(data)
}

export const resendingEmailJoi = (data: IResendingEmail) => {
  const schema = Joi.object<IResendingEmail>({
    email: Joi.string().email().required(),
  })
  return schema.validate(data)
}

export const updateSubscriptionJoi = (data: IUpdateSubscription) => {
  const schema = Joi.object<IUpdateSubscription>({
    subscription: Joi.string().valid('starter', 'pro', 'business').required(),
  })
  return schema.validate(data)
}

export const updateStatusContactJoi = (data: IUpdateStatusContact) => {
  const schema = Joi.object<IUpdateStatusContact>({
    favorite: Joi.boolean().required(),
  })
  return schema.validate(data)
}
