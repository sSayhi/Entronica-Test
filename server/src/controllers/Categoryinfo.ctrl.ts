import { Response, Request } from "express";
import { categoryInfoService } from "../services/CategoryinfoService";
import { injectable } from "tsyringe";

@injectable()
export class CategoryinfoController {
  constructor(private readonly service: categoryInfoService) {}

  async getActiveCategoryInfo(req: Request, res: Response) {
    try {
      console.info(
        `START getActiveCategoryInfo with username: ${req.body.username}`,
      );
      const user = await this.service.FindCetegoryInfoOnActive();
      console.info(
        "Successfully GET : getActiveCategoryInfo => user information",
      );
      res.status(200).json({
        message: "Successfully GET : getActiveCategoryInfo => user information",
        Data: user,
      });
    } catch (err: any) {
      console.error(`Error in getActiveCategoryInfo: ${err.message}`);
      res.status(500).json({ message: err.message });
    }
  }

  async createCategoryInfo(req: Request, res: Response) {
    try {
      console.info("START createCategoryInfo");
      const { CategoryInfo } = req.body;

      if (!CategoryInfo) {
        console.error("❌ Missing CategoryInfo information");
        return res
          .status(400)
          .json({ message: "Missing CategoryInfo information" });
      }

      const result = await this.service.createCategoryInfo(CategoryInfo);
      console.info("✅ Successfully added information in createCategoryInfo");
      return res.status(200).json({
        message: "Successfully added information",
        userId: `Created By : ${result.username}`,
      });
    } catch (err: any) {
      console.error("💥 ERROR createCategoryInfo: %o", err);
      return res.status(500).json({ message: err.message });
    }
  }

  async updateCategoryInfo(req: Request, res: Response) {
    try {
      console.info("START updateCategoryInfo");
      const { CategoryInfo } = req.body;

      const result = await this.service.editCategoryInfo(CategoryInfo);
      console.info("✅ Successfully updated information in updateCategoryInfo");
      return res.status(200).json({
        message: "Updated information Successfully",
        userId: `Update By : ${result.username}`,
      });
    } catch (err: any) {
      console.error("💥 ERROR updateCategoryInfo: %o", err);
      res.status(500).json({ message: err.message });
    }
  }
}
