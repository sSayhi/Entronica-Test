import { injectable } from "tsyringe";
import { Repository } from "../repositories/repository";
import { SqlDto } from "../models/buildSql";
import db from "../configs/postgres";
import { User_ImagesDTO } from "../models/user_images.dto";
import { EntityManager } from "typeorm";
import path from "path";
import { path_DIR } from "../middlewares/multer";

@injectable()
export class AttachmentService {
    constructor(private readonly repository: Repository) { }

    private toWebPath(absPath: string): string {
        const relFromUploads = path.relative(path_DIR, absPath);
        return `/uploads/${relFromUploads}`.replace(/\\/g, "/");
    }

    async acttchFile(manager: EntityManager, files : Express.Multer.File, UserId: string , Category : number) {
        try {
            console.info("AttachmentService -> acttchFile running...");
            const newFile: User_ImagesDTO = {
                img_category: 0,
                file_name: files.filename,
                file_path: this.toWebPath(files.destination),
                username_id: UserId
            };

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

    async getFileByTicket(UserId: number) {
        try {
            const generateQuery: SqlDto = {
                columnSelect: "img_category, file_path, file_name",
                fromTable: 'public."user_images"',
                whereColumn: `user_id = ${UserId}`,
            };
            const result = await this.repository.select(generateQuery);
            return { data: result, status: 'IsOk' };
        } catch (error) {
            console.error("categoryInfoService -> editCategoryInfo error: ", error);
            throw error;
        }
    }
}