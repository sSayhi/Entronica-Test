import { Response, Request } from "express";
import { Skillervice } from "../services/SkillService";
import { injectable } from "tsyringe";

@injectable()
export class SkillController {
  constructor(private readonly service: Skillervice) {}

  async getSkillsById(req: Request, res: Response) {
    try {
      console.info(`START getSkillsById with UserId: ${req.body.UserId}`);
      const { UserId } = req.body;
      if (!UserId) {
        console.error("❌ Missing UserId in request body");
        return res
          .status(400)
          .json({ message: "Missing UserId in request body" });
      }
      const user = await this.service.findSkillById(UserId);
      console.info("Successfully GET : getSkillsById => user information");
      res.status(200).json({
        message: "Successfully GET : getSkillsById => user information",
        Data: user,
      });
    } catch (err: any) {
      console.error(`Error in getSkillsById: ${err.message}`);
      res.status(500).json({ message: err.message });
    }
  }

  async createSkills(req: Request, res: Response) {
    try {
      console.info("START createSkills");
      const { Skills } = req.body;

      if (!Skills) {
        console.error("❌ Missing Skills information");
        return res
          .status(400)
          .json({ message: "Missing Skills information" });
      }

      const result = await this.service.createSkillInfo(Skills);
      console.info("✅ Successfully added information in createSkills");
      return res.status(200).json({
        message: "Successfully added information",
        userId: `Created By : ${result.username}`,
      });
    } catch (err: any) {
      console.error("💥 ERROR createSkills: %o", err);
      return res.status(500).json({ message: err.message });
    }
  }
}
