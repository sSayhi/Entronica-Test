import { Response, Request } from "express";
import { experienceService } from "../services/ExperienceService";
import { UserDTO } from "../models/user.dto";
import { injectable } from "tsyringe";

@injectable()
export class ExperienceController {
  constructor(private readonly service: experienceService) {}

  async getExperienceInfoById(req: Request, res: Response) {
    try {
      console.info(`START getExperienceInfo with UserId: ${req.body.UserId}`);
      
      const { UserId } = req.body;
      if (!UserId) {
        console.error("❌ Missing UserId in request body");
        return res
          .status(400)
          .json({ message: "Missing UserId in request body" });
      }
      const data = await this.service.FindExperienceById(UserId);
      console.info("Successfully GET : getExperienceInfo => user information");
      res.json({
        message: "Successfully GET : getExperienceInfo => user information",
        Data: data,
      });
    } catch (err: any) {
      console.error(`Error in getExperienceInfo: ${err.message}`);
      res.status(500).json({ message: err.message });
    }
  }

  async createExperience(req: Request, res: Response) {
    try {
      console.info("START createExperience");
      const { Experience } = req.body;

      if (!Experience) {
        console.error("❌ Missing Experience information");
        return res
          .status(400)
          .json({ message: "Missing Experience information" });
      }

      const result = await this.service.createexperience(Experience);
      console.info("✅ Successfully added information in createExperience");
      return res.status(200).json({
        message: "Successfully added information",
        userId: `Created By : ${result.username}`,
      });
    } catch (err: any) {
      console.error("💥 ERROR createExperience: %o", err);
      return res.status(500).json({ message: err.message });
    }
  }

  async deleteExperience(req: Request, res: Response) {
    try {
      console.info("START updateExperience");
      const { Experience } = req.body;

      const result = await this.service.removeExperience(Experience);
      console.info("✅ Successfully updated information in updateExperience");
      return res.status(200).json({
        message: "Updated information Successfully",
        userId: `Update By : ${result.username}`,
      });
    } catch (err: any) {
      console.error("💥 ERROR updateExperience: %o", err);
      res.status(500).json({ message: err.message });
    }
  }
}
