import db from "../configs/postgres";
import { SqlDto } from "../models/buildSql";
import { EntityManager } from "typeorm";

export class Repository {

  async select(getSqlDto: SqlDto) {
    const { columnSelect, fromTable, orderBy, whereColumn, joinset } =
      getSqlDto;
    const generateSql = `
    SELECT ${columnSelect}
    FROM ${fromTable}
    ${joinset && joinset.length ? `${joinset}` : ""}
    WHERE 1=1 ${whereColumn ? `AND ${whereColumn}` : ""}
    ${orderBy && orderBy.length ? `ORDER BY ${orderBy}` : ""}`;
    try {
      const result = await db.query(generateSql);
      return result;
    } catch (error) {
      console.error("Repository -> select error: ", error);
      throw error;
    }
  }

  async Save(manager: EntityManager, getSqlDto: SqlDto) {
    const { columnSelect, fromTable, values } = getSqlDto;
    const generateSql = `
    INSERT INTO ${fromTable} (${columnSelect})
    VALUES (${values})`;
    try {
      const result = await manager.query(generateSql);
      return result;
    } catch (error) {
      console.error("Repository -> Save error: ", error);
      throw error;
    }
  }

  async Edit(manager: EntityManager, getSqlDto: SqlDto) {
    const { fromTable, whereColumn, values } = getSqlDto;
    const generateSql = `
    UPDATE ${fromTable} 
    SET ${values}
    WHERE ${whereColumn}`;
    try {
      const result = await manager.query(generateSql);
      return result;
    } catch (error) {
      console.error("Repository -> Edit error: ", error);
      throw error;
    }
  }

  async remove(manager: EntityManager, getSqlDto: SqlDto) {
    const { fromTable, whereColumn } = getSqlDto;
    const generateSql = ` 
    DELETE FROM ${fromTable} 
    WHERE ${whereColumn}`;
    try {
      const result = await manager.query(generateSql);
      return result;
    } catch (error) {
      console.error("Repository -> remove error: ", error);
      throw error;
    }
  }
}
