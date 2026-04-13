import { experienceDTO } from "../models/experience.dto";
import { Repository } from "../repositories/repository";
import { Response, Request } from "express";
import { SqlDto } from "../models/buildSql";
import { injectable } from "tsyringe";
import db from "../configs/postgres";
import { EducationDTO } from "../models/education.dto";

@injectable()
export class experienceService {
  constructor(private readonly repository: Repository) {}

  async FindExperienceById(user_id: number) {
    const generateQuery: SqlDto = {
      columnSelect: "*",
      fromTable: 'public.experience',
      whereColumn: `user_id = '${user_id}'`,
    };
    const result = await this.repository.select(generateQuery);
    return result;
  }

  async createexperience(experience: experienceDTO) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("ExperienceService -> createExperience running...");
      const generateQuery: SqlDto = {
        columnSelect: "user_id, company, position, start_date, end_date",
        fromTable: 'public.experience',
        values: `'${experience.user_id}', '${experience.company}', '${experience.position}', '${experience.start_date}', '${experience.end_date}'`,
      };
      const result = await this.repository.Save(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("ExperienceService -> createExperience error: ", error);
      throw error;
    }
  }

  async removeExperience(experience: experienceDTO) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("ExperienceService -> editExperience running...");
      const generateQuery: SqlDto = {
        fromTable: 'public.experience',
        whereColumn: `user_id = '${experience.user_id}' AND company = '${experience.company}'`,
      };
      const result = await this.repository.remove(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("ExperienceService -> editExperience error: ", error);
      throw error;
    }
  }

  async deleteExperience(user_id: number) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("ExperienceService -> deleteExperience running...");
      const generateQuery: SqlDto = {
        fromTable: 'public.experience',
        whereColumn: `user_id = '${user_id}'`,
      };
      const result = await this.repository.remove(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("ExperienceService -> deleteExperience error: ", error);
      throw error;
    }
  }
}
