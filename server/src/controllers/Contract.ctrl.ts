import { Response, Request } from "express";
import { ContactService } from "../services/ContactService";
import { UserDTO } from "../models/user.dto";
import { injectable } from "tsyringe";

@injectable()
export class ContactController {
  constructor(private readonly service: ContactService) {}

  async getContactInfoById(req: Request, res: Response) {
    try {
      console.info(
        `START getContactInfo with UserId: ${req.body.username}`,
      );

      const { username } = req.body;
      if (!username) {
        console.error("❌ Missing UserId in request body");
        return res
          .status(400)
          .json({ message: "Missing UserId in request body" });
      }
      const user = await this.service.FindContactById(username);
      console.info("Successfully GET : getContactInfo => user information");
      res.json({
        message: "Successfully GET : getContactInfo => user information",
        Data: user,
      });
    } catch (err: any) {
      console.error(`Error in getContactInfo: ${err.message}`);
      res.status(500).json({ message: err.message });
    }
  }

  async createContact(req: Request, res: Response) {
    try {
      console.info("START createContact");
      const { Contact } = req.body;

      if (!Contact) {
        console.error("❌ Missing Contact information");
        return res.status(400).json({ message: "Missing Contact information" });
      }

      const reqDto = await this.service.createContact(Contact);
      console.info("✅ Successfully added information in createContact");
      return res.status(200).json({
        message: "Successfully added information",
        userId: `Created By : ${reqDto.username}`,
      });
    } catch (err: any) {
      console.error("💥 ERROR createContact: %o", err);
      return res.status(500).json({ message: err.message });
    }
  }

  async updateContact(req: Request, res: Response) {
    try {
      console.info("START updateContact");
    const { Contact } = req.body;

      const reqDto = await this.service.editContact(Contact);
      console.info("✅ Successfully updated information in updateContact");
      return res.status(200).json({
        message: "Updated information Successfully",
        userId: `Update By : ${reqDto.username}`,
      });
    } catch (err: any) {
      console.error("💥 ERROR updateContact: %o", err);
      res.status(500).json({ message: err.message });
    }
  }
}
