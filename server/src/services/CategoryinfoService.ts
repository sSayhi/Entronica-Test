import{ categoryInfoDTO } from "../models/categoryInfo.dto";
import { Repository } from "../repositories/repository";
import { Response, Request } from "express";
import { SqlDto } from "../models/buildSql";
import { injectable } from "tsyringe";
import db from "../configs/postgres";

@injectable()
export class categoryInfoService {
  constructor(private readonly repository: Repository) {}

  async FindCategoryInfoList() {
    const generateQuery: SqlDto = {
      columnSelect: "*",
      fromTable: 'public.CategoryInfo',
    };
    const result = await this.repository.select(generateQuery);
    return result;
  } 

  async FindCetegoryInfoOnActive() {
    const generateQuery: SqlDto = {
      columnSelect: "*",
      fromTable: 'public.CategoryInfo',
      whereColumn: `active = 1`,
    };
    const result = await this.repository.select(generateQuery);
    return result;
  }

  async createCategoryInfo(categoryInfo: categoryInfoDTO) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("categoryInfoService -> createCategoryInfo running...");
      const generateQuery: SqlDto = {
        columnSelect: "description , active",
        fromTable: 'public.CategoryInfo',
        values: `'${categoryInfo.description}', true`,
      };
      const result = await this.repository.Save(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("categoryInfoService -> createCategoryInfo error: ", error);
      throw error;
    }
  }

  async editCategoryInfo(categoryInfo: categoryInfoDTO) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("categoryInfoService -> editCategoryInfo running...");
      const generateQuery: SqlDto = {
        fromTable: 'public.CategoryInfo',
        whereColumn: `category_id = '${categoryInfo.category_id}'`,
        values: `description = '${categoryInfo.description}', active = ${categoryInfo.active ? 1 : 0}`,
      };
      const result = await this.repository.Edit(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("categoryInfoService -> editCategoryInfo error: ", error);
      throw error;
    }
  }
}
