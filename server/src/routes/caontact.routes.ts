import Express, { Response, Request }  from "express";   
import { ContactController } from "../controllers/Contract.ctrl";
import { container } from "tsyringe";


const router = Express.Router()
const ctrl = container.resolve(ContactController);

const baseUrl = '/ContactSvc';

router.post(`${baseUrl}/getByUsername`,(req : Request , res : Response) => ctrl.getContactInfoById(req ,res));
router.post(`${baseUrl}/CreateContact`,Express.text({ type: 'text/plain'}),(req : Request , res : Response) => ctrl.createContact(req ,res));
router.put(`${baseUrl}/UpdateContact`,Express.text({ type: 'text/plain'}),(req : Request , res : Response) => ctrl.updateContact(req ,res));

export default router;