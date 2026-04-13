import { EducationDTO } from "../models/education.dto";
import { Repository } from "../repositories/repository";
import { Response, Request } from "express";
import { SqlDto } from "../models/buildSql";
import { injectable } from "tsyringe";
import db from "../configs/postgres";

@injectable()
export class educationService {
  constructor(private readonly repository: Repository) {}

  async FindEducationById(UserId: string) {
    const generateQuery: SqlDto = {
      columnSelect: "*",
      fromTable: 'public.education',
      whereColumn: `user_id = '${UserId}'`,
    };
    const result = await this.repository.select(generateQuery);
    return result;
  } 

  async createeducation(education: EducationDTO) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("EducationService -> createEducation running...");
      const generateQuery: SqlDto = {
        columnSelect: "user_id, year, location",
        fromTable: 'public.education',
        values: `'${education.user_id}', '${education.year}', '${education.location}'`,
      };
      const result = await this.repository.Save(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("EducationService -> createEducation error: ", error);
      throw error;
    }
  }

  async editEducation(education: EducationDTO) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("EducationService -> editEducation running...");
      const generateQuery: SqlDto = {
        fromTable: 'public.education',
        whereColumn: `user_id = '${education.user_id}'`,
        values: `year = '${education.year}', location = '${education.location}'`,
      };
      const result = await this.repository.Edit(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("EducationService -> editEducation error: ", error);
      throw error;
    }
  }
}
