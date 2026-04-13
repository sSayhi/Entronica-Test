import Express, { Response, Request }  from "express";   
import { SkillController } from "../controllers/Skill.ctrl";
import { container } from "tsyringe";


const router = Express.Router()
const ctrl = container.resolve(SkillController);

const baseUrl = '/SkillSvc';

router.post(`${baseUrl}/getByUsername`,(req : Request , res : Response) => ctrl.getSkillsById(req ,res));
router.post(`${baseUrl}/CreateSkill`,Express.text({ type: 'text/plain'}),(req : Request , res : Response) => ctrl.createSkills(req ,res));
router.put(`${baseUrl}/UpdateSkill`,Express.text({ type: 'text/plain'}),(req : Request , res : Response) => ctrl.updateSkills(req ,res));

export default router;