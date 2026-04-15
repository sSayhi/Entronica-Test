import { Response, Request } from "express";
import { educationService } from "../services/EducationService";
import { UserDTO } from "../models/user.dto";
import { injectable } from "tsyringe";

@injectable()
export class EducationController {
  constructor(private readonly service: educationService) {}

  async getEducationInfoById(req: Request, res: Response) {
    try {
      console.info(`START getEducationInfo with UserId: ${req.body.UserId}`);
      const { UserId } = req.body;
      if (!UserId) {
        console.error("❌ Missing UserId in request body");
        return res
          .status(400)
          .json({ message: "Missing UserId in request body" });
      }
      const user = await this.service.FindEducationById(UserId);
      console.info("Successfully GET : getEducationInfo => user information");
      res.status(200).json({
        message: "Successfully GET : getEducationInfo => user information",
        Data: user,
      });
    } catch (err: any) {
      console.error(`Error in getEducationInfo: ${err.message}`);
      res.status(500).json({ message: err.message });
    }
  }

  async createEducation(req: Request, res: Response) {
    try {
      console.info("START createEducation");
      const { Education } = req.body;

      if (!Education) {
        console.error("❌ Missing Education information");
        return res.status(400).json({ message: "Missing Education information" });
      }

      const result = await this.service.createeducation(Education);
      console.info("✅ Successfully added information in createEducation");
      return res.status(200).json({
        message: "Successfully added information",
        userId: `Created By : ${result.username}`,
      });
    } catch (err: any) {
      console.error("💥 ERROR createEducation: %o", err);
      return res.status(500).json({ message: err.message });
    }
  }

  async updateEducation(req: Request, res: Response) {
    try {
      console.info("START updateEducation");
      const { Education } = req.body;

      const result = await this.service.editEducation(Education);
      console.info("✅ Successfully updated information in updateEducation");
      return res.status(200).json({
        message: "Updated information Successfully",
        userId: `Update By : ${result.username}`,
      });
    } catch (err: any) {
      console.error("💥 ERROR updateEducation: %o", err);
      res.status(500).json({ message: err.message });
    }
  }
}
