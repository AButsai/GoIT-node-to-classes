import { Router } from 'express'
import { User } from '../../controllers/userCtrl/userCtrl.js'
import { controllerWrapper } from '../../middleware/controllerWrapper.js'
import { upload } from '../../middleware/upload.js'
import { validationBody } from '../../middleware/validationBody.js'
import { validationSuccessToken } from '../../middleware/validationJWT.js'
import { updateSubscriptionJoi } from '../../model/joiSchemas/validationsJoi.js'
import { UserService } from '../../services/userService/userService.js'
const userService = new UserService()
const user = new User(userService)

const userRouter = Router()

userRouter.use(validationSuccessToken)

userRouter.get('/current', controllerWrapper(user.current.bind(user)))

userRouter.patch(
  '/subscription',
  validationBody(updateSubscriptionJoi),
  controllerWrapper(user.subscription.bind(user)),
)

userRouter.patch('/avatar', upload.single('avatar'), controllerWrapper(user.avatar.bind(user)))

export default userRouter
