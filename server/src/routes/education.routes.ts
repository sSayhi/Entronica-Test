import Express, { Response, Request }  from "express";   
import { EducationController } from "../controllers/Education.ctrl";
import { container } from "tsyringe";


const router = Express.Router()
const ctrl = container.resolve(EducationController);

const baseUrl = '/EducationSvc';

router.post(`${baseUrl}/getByUsername`,(req : Request , res : Response) => ctrl.getEducationInfoById(req ,res));
router.post(`${baseUrl}/CreateEducation`,Express.text({ type: 'text/plain'}),(req : Request , res : Response) => ctrl.createEducation(req ,res));
router.put(`${baseUrl}/UpdateEducation`,Express.text({ type: 'text/plain'}),(req : Request , res : Response) => ctrl.updateEducation(req ,res));

export default router;