import { Router } from 'express'
import { Contacts } from '../../controllers/contactsCtrl/contactsCtrl.js'
import { controllerWrapper } from '../../middleware/controllerWrapper.js'
import { validationBody } from '../../middleware/validationBody.js'
import { validationSuccessToken } from '../../middleware/validationJWT.js'
import { contactJoiSchema, updateStatusContactJoi } from '../../model/joiSchemas/validationsJoi.js'
import { ContactService } from '../../services/contactsService/contactsService.js'
import { UserService } from '../../services/userService/userService.js'
const contactService = new ContactService()
const userService = new UserService()
const contact = new Contacts(contactService, userService)

const contactsRouter = Router()

contactsRouter.use(validationSuccessToken)

contactsRouter.get('/', controllerWrapper(contact.getAllContact.bind(contact)))
contactsRouter.get('/:contactId', controllerWrapper(contact.getContactById.bind(contact)))
contactsRouter.post('/', validationBody(contactJoiSchema), controllerWrapper(contact.addContact.bind(contact)))
contactsRouter.delete('/:contactId', controllerWrapper(contact.deleteContact.bind(contact)))
contactsRouter.put(
  '/:contactId',
  validationBody(contactJoiSchema),
  controllerWrapper(contact.updateContact.bind(contact)),
)
contactsRouter.patch(
  '/:contactId/favorite',
  validationBody(updateStatusContactJoi),
  controllerWrapper(contact.updateStatusContact.bind(contact)),
)

export default contactsRouter
