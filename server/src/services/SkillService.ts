import { SkillDto } from "../models/skill.dto";
import { Repository } from "../repositories/repository";
import { Response, Request } from "express";
import { SqlDto } from "../models/buildSql";
import { injectable } from "tsyringe";
import db from "../configs/postgres";

@injectable()
export class Skillervice {
  constructor(private readonly repository: Repository) {}

  async findSkillById(UserId: string) {
    const generateQuery: SqlDto = {
      columnSelect: "*",
      fromTable: 'public.skill',
      whereColumn: `user_id = '${UserId}'`,
    };
    const result = await this.repository.select(generateQuery);
    return result;
  }

  async createSkillInfo(Skill: SkillDto) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("Skillervice -> createSkill running...");
      const generateQuery: SqlDto = {
        columnSelect: "user_id, skill, level",
        fromTable: 'public.skill',
        values: `'${Skill.user_id}', '${Skill.skill}', '${Skill.level}'`,
      };
      const result = await this.repository.Save(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Skillervice -> createSkill error: ", error);
      throw error;
    }
  }

  async editSkillInfo(skill: SkillDto) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("Skillervice -> editSkillInfo running...");
      const generateQuery: SqlDto = {
        fromTable: 'public.skill',
        whereColumn: `user_id = '${skill.user_id}' AND skill = '${skill.skill}'`,
        values: `level = '${skill.level}'`,
      };
      const result = await this.repository.Edit(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Skillervice -> editSkillInfo error: ", error);
      throw error;
    }
  }

  async deleteSkillInfo(skill: SkillDto) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("Skillervice -> deleteSkillInfo running...");
      const generateQuery: SqlDto = {
        fromTable: 'public.skill',
        whereColumn: `user_id = '${skill.user_id}' AND skill_id = '${skill.skill_id}'`,
      };
      const result = await this.repository.remove(manager, generateQuery);
      await queryRunner.commitTransaction();
      return result;

    } catch (error) {
      console.error("Skillervice -> deleteSkillInfo error: ", error);
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }
}
