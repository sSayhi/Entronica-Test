import { UserDTO } from "../models/user.dto";
import { Repository } from "../repositories/repository";
import { Response, Request } from "express";
import { SqlDto } from "../models/buildSql";
import { injectable } from "tsyringe";
import db from "../configs/postgres";
import { AttachmentService } from "./AttachFileService";

@injectable()
export class UserService {
  constructor(private readonly repository: Repository, private readonly attachmentService: AttachmentService) { }

  async getUserList() {
    const generateQuery: SqlDto = {
      columnSelect: "*",
      fromTable: 'public."User"',
      orderBy: 'key_id asc'
    };
    const result = await this.repository.select(generateQuery);
    return result;
  }

  async FindUserByUsername(username: string) {
    const generateQuery: SqlDto = {
      columnSelect: 'key_id, username, nickname, firstname, lastname, "position", nationality, phone, start_date, created_at , ui.file_path , ui.file_name ,ui.img_category',
      fromTable: 'public."User" u',
      joinset: 'left join public.user_images ui  on u.username = ui.username_id ',
      whereColumn: `username = '${username}'`,
    };
    const result = await this.repository.select(generateQuery);
    return result;
  }

  async createUserInfo(User: UserDTO, files: Express.Multer.File[], Category: any) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("UserService -> createUserInfo running...");
      const generateQuery: SqlDto = {
        columnSelect:
          "username, nickname, firstname, lastname, position, nationality, phone, start_date",
        fromTable: 'public."User"',
        values: `'${User.username}', '${User.nickname}', '${User.firstname}', '${User.lastname}', '${User.position}', '${User.nationality}', '${User.phone}', '${User?.start_date ?? '2026-01-01'}'`,
      };
      await this.repository.Save(manager, generateQuery);
      if (Array.isArray(files) && files.length > 0) {
        const uploadPromises = files.map((file, index) =>
          this.attachmentService.acttchFile(queryRunner.manager, file, User.username, Category[index])
        );
        await Promise.all(uploadPromises);
      }
      await queryRunner.commitTransaction();

      return User.username;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("UserService -> createUserInfo error: ", error);
      throw error;
    }
  }

  async editUserInfo(User: UserDTO, files: Express.Multer.File[], Category: any) {
    const queryRunner = db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = db.manager;
    try {
      console.info("UserService -> editUserInfo running...");
      const generateQuery: SqlDto = {
        fromTable: 'public."User"',
        whereColumn: `username = '${User.username}'`,
        values: `nickname = '${User.nickname}', firstname = '${User.firstname}', lastname = '${User.lastname}', position = '${User.position}', nationality = '${User.nationality}', phone = '${User.phone}', start_date = '${User.start_date}'`,
      };
      const result = await this.repository.Edit(manager, generateQuery);
      if (Array.isArray(files) && files.length > 0) {
        const uploadPromises = files.map((file, index) =>
          this.attachmentService.acttchFile(queryRunner.manager, file, User.username, Category[index])
        );
        await Promise.all(uploadPromises);
      }
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("UserService -> editUserInfo error: ", error);
      throw error;
    }
  }
}
