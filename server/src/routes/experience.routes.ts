import Express, { Response, Request }  from "express";   
import { ExperienceController } from "../controllers/Experience.ctrl";
import { container } from "tsyringe";


const router = Express.Router()
const ctrl = container.resolve(ExperienceController);

const baseUrl = '/ExperienceSvc';

router.post(`${baseUrl}/getByUsername`,(req : Request , res : Response) => ctrl.getExperienceInfoById(req ,res));
router.post(`${baseUrl}/CreateExperience`,Express.text({ type: 'text/plain'}),(req : Request , res : Response) => ctrl.createExperience(req ,res));
router.put(`${baseUrl}/DeleteExperience`,Express.text({ type: 'text/plain'}),(req : Request , res : Response) => ctrl.deleteExperience(req ,res));

export default router;