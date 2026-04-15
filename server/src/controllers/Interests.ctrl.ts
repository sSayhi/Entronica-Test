import { Response, Request } from "express";
import { interestsService } from "../services/InterestsService";
import { injectable } from "tsyringe";

@injectable()
export class InterestsController {
  constructor(private readonly service: interestsService) {}

  async getInterestsById(req: Request, res: Response) {
    try {
      console.info(`START getInterestsById with UserId: ${req.body.UserId}`);
      const { UserId } = req.body;
      if (!UserId) {
        console.error("❌ Missing UserId in request body");
        return res
          .status(400)
          .json({ message: "Missing UserId in request body" });
      }
      const user = await this.service.FindInterestsById(UserId);
      console.info("Successfully GET : getInterestsById => user information");
      res.status(200).json({
        message: "Successfully GET : getInterestsById => user information",
        Data: user,
      });
    } catch (err: any) {
      console.error(`Error in getInterestsById: ${err.message}`);
      res.status(500).json({ message: err.message });
    }
  }

  async createInterests(req: Request, res: Response) {
    try {
      console.info("START createInterests");
      const { Interests } = req.body;

      if (!Interests) {
        console.error("❌ Missing Interests information");
        return res
          .status(400)
          .json({ message: "Missing Interests information" });
      }

      const result = await this.service.createinterests(Interests);
      console.info("✅ Successfully added information in createInterests");
      return res.status(200).json({
        message: "Successfully added information",
        userId: `Created By : ${result.username}`,
      });
    } catch (err: any) {
      console.error("💥 ERROR createInterests: %o", err);
      return res.status(500).json({ message: err.message });
    }
  }

  async deleteInterests(req: Request, res: Response) {
    try {
      console.info("START updateInterests");
      const { Interests } = req.body;

      const result = await this.service.removeInterests(Interests);
      console.info("✅ Successfully updated information in updateInterests");
      return res.status(200).json({
        message: "Updated information Successfully",
        userId: `Update By : ${result.username}`,
      });
    } catch (err: any) {
      console.error("💥 ERROR updateInterests: %o", err);
      res.status(500).json({ message: err.message });
    }
  }
}
