import Express, { Response, Request }  from "express";   
import { InterestsController } from "../controllers/Interests.ctrl";
import { container } from "tsyringe";


const router = Express.Router()
const ctrl = container.resolve(InterestsController);

const baseUrl = '/InterestsSvc';

router.post(`${baseUrl}/getByUsername`,(req : Request , res : Response) => ctrl.getInterestsById(req ,res));
router.post(`${baseUrl}/CreateInterests`,Express.text({ type: 'text/plain'}),(req : Request , res : Response) => ctrl.createInterests(req ,res));
router.put(`${baseUrl}/deleteInterests`,Express.text({ type: 'text/plain'}),(req : Request , res : Response) => ctrl.deleteInterests(req ,res));

export default router;