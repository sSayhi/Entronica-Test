import { ContactDTO } from "../models/contact.dto";
import { Repository } from "../repositories/repository";
import { Response, Request } from "express";
import { SqlDto } from "../models/buildSql";
import { injectable } from "tsyringe";
import db from "../configs/postgres";
import { categoryInfoDTO } from "../models/categoryInfo.dto";

@injectable()
export class ContactService {
  constructor(private readonly repository: Repository) {}

  async FindContactById(user_id: string) {
    const generateQuery: SqlDto = {
      columnSelect: "*",
      fromTable: 'public."contact"',
      whereColumn: `user_id = '${user_id}'`,
    };
    const result = await this.repository.select(generateQuery);
    return result;
  } 

  async createContact(contact: ContactDTO) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("ContactService -> createContact running...");
      const generateQuery: SqlDto = {
        columnSelect: "user_id, address, sub_district, district, province, postal_code, facebook, line_id, instagram",
        fromTable: 'public.contact',
        values: `'${contact.user_id}', '${contact.address}', '${contact.sub_district}', '${contact.district}', '${contact.province}', '${contact.postal_code}', '${contact?.facebook ?? ''}', '${contact?.line_id ?? ''}', '${contact?.instagram ?? ''}'`,
      };
      const result = await this.repository.Save(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("ContactService -> createContact error: ", error);
      throw error;
    }
  }

  async editContact(contact: ContactDTO) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("ContactService -> editContact running...");
      const generateQuery: SqlDto = {
        fromTable: 'public."Contacts"',
        whereColumn: `user_id = '${contact.user_id}'`,
        values: `address = '${contact.address}', sub_district = '${contact.sub_district}', district = '${contact.district}', province = '${contact.province}', postal_code = '${contact.postal_code}', facebook = '${contact.facebook}', line_id = '${contact.line_id}', instagram = '${contact.instagram}'`,
      };
      const result = await this.repository.Edit(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("ContactService -> editContact error: ", error);
      throw error;
    }
  }
}
