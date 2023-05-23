import { Router } from 'express'

import { Authentication } from '../../controllers/authCtrl/authCtrl.js'
import { controllerWrapper } from '../../middleware/controllerWrapper.js'
import { validationBody } from '../../middleware/validationBody.js'
import { validationRefreshToken, validationSuccessToken } from '../../middleware/validationJWT.js'
import { authenticationJoiSchema, resendingEmailJoi } from '../../model/joiSchemas/validationsJoi.js'
import { SendEmail } from '../../services/emailService/sendEmail.js'
import { UserService } from '../../services/userService/userService.js'
import { Email } from '../../controllers/emailCtrl/emailCtrl.js'
const userService = new UserService()
const sendEmail = new SendEmail()
const email = new Email(userService, sendEmail)
const authCtrl = new Authentication(userService, sendEmail)

const authRouter = Router()

authRouter.get('/logout', validationSuccessToken, controllerWrapper(authCtrl.logout.bind(authCtrl)))
authRouter.get('/refresh-token', validationRefreshToken, controllerWrapper(authCtrl.refresh.bind(authCtrl)))
authRouter.get('/verify/:verificationToken', controllerWrapper(email.verifyEmail.bind(email)))
authRouter.post('/resend-email', validationBody(resendingEmailJoi), controllerWrapper(email.resendingEmail.bind(email)))
authRouter.post(
  '/register',
  validationBody(authenticationJoiSchema),
  controllerWrapper(authCtrl.register.bind(authCtrl)),
)
authRouter.post('/login', validationBody(authenticationJoiSchema), controllerWrapper(authCtrl.login.bind(authCtrl)))

export default authRouter
