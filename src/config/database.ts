import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export class DatabaseSingleton {
  // #region singletonConfig
  private static instance: DatabaseSingleton;
  private pool: mysql.Pool;

  private constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  public static getInstance(): DatabaseSingleton {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }
  // #endregion

  public getPool(): mysql.Pool {
    return this.pool;
  }
}
