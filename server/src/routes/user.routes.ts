import Express, { Response, Request } from "express";
import { UserController } from "../controllers/User.ctrl";
import { container } from "tsyringe";
import { uploadImg } from "../middlewares/multer";


const router = Express.Router()
const ctrl = container.resolve(UserController);

const baseUrl = '/UserSvc';

router.get(`${baseUrl}/GetList`, (req: Request, res: Response) => ctrl.getlistUser(req, res));
router.post(`${baseUrl}/getByUsername`, Express.text({ type: 'text/plain' }), (req: Request, res: Response) => ctrl.getUserByUsername(req, res));
router.post(`${baseUrl}/CreateProfile`, uploadImg.array('BG_File'), (req: Request, res: Response) => ctrl.createUserInfo(req, res));
router.put(`${baseUrl}/UpdateProfile`, uploadImg.array('BG_File'), (req: Request, res: Response) => ctrl.updateUserInfo(req, res));

export default router;