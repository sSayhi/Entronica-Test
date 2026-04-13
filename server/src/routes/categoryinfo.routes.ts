import Express, { Response, Request }  from "express";   
import { CategoryinfoController } from "../controllers/Categoryinfo.ctrl";
import { container } from "tsyringe";


const router = Express.Router()
const ctrl = container.resolve(CategoryinfoController);

const baseUrl = '/CategoryInfoSvc';

router.get(`${baseUrl}/getByUsername`,(req : Request , res : Response) => ctrl.getActiveCategoryInfo(req ,res));
router.post(`${baseUrl}/CreateCategoryInfo`,Express.text({ type: 'text/plain'}),(req : Request , res : Response) => ctrl.createCategoryInfo(req ,res));
router.put(`${baseUrl}/UpdateCategoryInfo`,Express.text({ type: 'text/plain'}),(req : Request , res : Response) => ctrl.updateCategoryInfo(req ,res));

export default router;