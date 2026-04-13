import { Response, Request } from "express";
import { UserService } from "../services/UserService";
import { UserDTO } from "../models/user.dto";
import { injectable } from "tsyringe";

@injectable()
export class UserController {
  constructor(private readonly service: UserService) { }

  async getlistUser(req: Request, res: Response) {
    try {
      console.info(`START getlistUser`,);

      const user = await this.service.getUserList();
      console.info("Successfully GET : getlistUser => user information");
      res.json({
        message: "Successfully GET : getlistUser => user information",
        Data: user,
      });
    } catch (err: any) {
      console.error(`Error in getlistUser: ${err.message}`);
      res.status(500).json({ message: err.message });
    }
  }

  async getUserByUsername(req: Request, res: Response) {
    try {
      console.info(`START getUserByUsername with username: ${req.body.username}`);
      const { username } = req.body;

      if (!username) {
        console.error("❌ Missing username in request body");
        return res.status(400).json({ message: "Missing username in request body" });
      }
      const user = await this.service.FindUserByUsername(username);
      if (user) {
        const SERVER_URL = 'http://localhost:8080';
        const imageUrl = user
          .filter((u: any) => u.file_path && u.file_name) // กัน null
          .map((u: any) => ({
            url: `${SERVER_URL}/assets/${u.file_path}/${u.file_name}`,
            category : u.img_category
          }));

        console.info("Successfully GET : getUserByUsername => user information");
        res.json({
          message: "Successfully GET : getUserByUsername => user information",
          Data: user,
          displayImage: imageUrl
        });
      }

    } catch (err: any) {
      console.error(`Error in getUserByUsername: ${err.message}`);
      res.status(500).json({ message: err.message });
    }
  }

  async createUserInfo(req: Request, res: Response) {
    try {
      console.info("Start createUserInfo");
      const { User } = req.body;

      const user: UserDTO = JSON.parse(User);
      const files = req.files as Express.Multer.File[] | [];

      if (!User) {
        console.error("❌ Missing User information");
        return res.status(400).json({ message: "Missing User information" });
      }

      const result = await this.service.createUserInfo(user, files, req.body.Category);
      console.info("✅ Successfully added information in createUserInfo");
      return res.status(200).json({
        message: "Successfully added information",
        userId: `${result}`,
      });
    } catch (err: any) {
      console.error("💥 ERROR createUserInfo: %o", err);
      return res.status(500).json({ message: err.message });
    }
  }

  async updateUserInfo(req: Request, res: Response) {
    try {
      console.info("START updateUserInfo");
      const { User } = req.body;

      const result = await this.service.editUserInfo(User);
      console.info("✅ Successfully updated information in updateUserInfo");
      return res.status(200).json({
        message: "Updated information Successfully",
        userId: `UserId : ${result.username}`,
      });
    } catch (err: any) {
      console.error("💥 ERROR updateUserInfo: %o", err);
      res.status(500).json({ message: err.message });
    }
  }
}
