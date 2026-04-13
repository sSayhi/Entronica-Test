import { interestsDTO } from "../models/interests.dto";
import { Repository } from "../repositories/repository";
import { Response, Request } from "express";
import { SqlDto } from "../models/buildSql";
import { injectable } from "tsyringe";
import db from "../configs/postgres";
import { experienceDTO } from "../models/experience.dto";

@injectable()
export class interestsService {
  constructor(private readonly repository: Repository) {}

  async FindInterestsById(user_id: number) {
    const generateQuery: SqlDto = {
      columnSelect: "*",
      fromTable: 'public.interests',
      whereColumn: `user_id = '${user_id}'`,
    };
    const result = await this.repository.select(generateQuery);
    return result;
  }

  async createinterests(interests: interestsDTO) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("InterestsService -> createInterests running...");
      const generateQuery: SqlDto = {
        columnSelect: "user_id, category_id, name",
        fromTable: 'public.interests',
        values: `'${interests.user_id}', ${interests.category_id}, '${interests.name}'`,
      };
      const result = await this.repository.Save(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("InterestsService -> createInterests error: ", error);
      throw error;
    }
  }

  async removeInterests(interests: interestsDTO) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("InterestsService -> removeInterests running...");
      const generateQuery: SqlDto = {
        fromTable: 'public.interests',
        whereColumn: `user_id = '${interests.user_id}'AND category_id = ${interests.category_id}  AND name = '${interests.name}'`,
      };
      const result = await this.repository.remove(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("InterestsService -> removeInterests error: ", error);
      throw error;
    }
  }

  async deleteInterests(user_id: number, category_num: number) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("InterestsService -> deleteInterests running...");
      const generateQuery: SqlDto = {
        fromTable: 'public.interests',
        whereColumn: `user_id = '${user_id}' and category_num = '${category_num}'`,
      };
      const result = await this.repository.remove(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("InterestsService -> deleteInterests error: ", error);
      throw error;
    }
  }
}
