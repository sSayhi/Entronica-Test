import { injectable } from "tsyringe";
import { Repository } from "../repositories/repository";
import { SqlDto } from "../models/buildSql";
import db from "../configs/postgres";
import { User_ImagesDTO } from "../models/user_images.dto";
import { EntityManager } from "typeorm";
import fs from 'fs/promises';
import path from "path";
import { path_DIR } from "../middlewares/multer";

@injectable()
export class AttachmentService {
    constructor(private readonly repository: Repository) { }

    private toWebPath(absPath: string): string {
        const relFromUploads = path.relative(path_DIR, absPath);
        return `/uploads/${relFromUploads}`.replace(/\\/g, "/");
    }

    async acttchFile(manager: EntityManager, files: Express.Multer.File, UserId: string, Category: number) {
        try {
            console.info("AttachmentService -> acttchFile running...");
            const newFile: User_ImagesDTO = {
                img_category: 0,
                file_name: files.filename,
                file_path: this.toWebPath(files.destination),
                username_id: UserId
            };

            const findId = await this.getFileByUsername(UserId, Category);
            if (findId.data.length > 0) {
                for (const file of findId.data) {
                    const path = `${file.file_path}/${file.file_name}`
                    await this.deleteFile(path)
                    await this.deletePhoto(UserId, Category)
                }
            }

            const generateQuery: SqlDto = {
                fromTable: 'public.user_images',
                columnSelect: "file_path, file_name, img_category ,username_id",
                values: `'${newFile.file_path}' ,
              N'${newFile.file_name}',
              ${Category},
              '${newFile.username_id}'`,
            };

            await this.repository.Save(manager, generateQuery);
            return { status: 'IsOk' };
        } catch (error) {
            console.error("AttachmentService -> acttchFile error: ", error);
            throw error;
        }
    }

    async getFileByUsername(UserId: string, category: number) {
        try {
            const generateQuery: SqlDto = {
                columnSelect: "img_category, file_path, file_name",
                fromTable: 'public.user_images',
                whereColumn: `username_id = '${UserId}' AND img_category = '${category}'`,
            };
            const result = await this.repository.select(generateQuery);
            return { data: result, status: 'IsOk' };
        } catch (error) {
            console.error("AttachmentService -> getFileByUsername error: ", error);
            throw error;
        }
    }

    async deletePhoto(UserId: string, category: number) {
        const queryRunner = db.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const manager = db.manager;
        try {
            console.info("AttachmentService -> deletePhoto running...");
            const generateQuery: SqlDto = {
                fromTable: 'public.user_images',
                whereColumn: `username_id = '${UserId}' AND img_category = '${category}'`,
            };
            const result = await this.repository.remove(manager, generateQuery);
            await queryRunner.commitTransaction();
            return result;

        } catch (error) {
            console.error("AttachmentService -> deletePhoto error: ", error);
            await queryRunner.rollbackTransaction();
            throw error;
        }
    }

    async deleteFile(filename: string) {
        try {
            const folder = path.join(__dirname, '../../assets')
            const filepath = folder + '/' + filename
            await fs.unlink(filepath);
        } catch (err) {
            console.error('error:', err);
        }
    }
}