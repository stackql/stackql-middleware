// services/duckdb.service.ts
import { open } from "https://deno.land/x/duckdb/mod.ts";
import { config } from "../config/environment.ts";
import { logger } from "./logger.service.ts";

class DuckDBService {
  private db;
  private connection;

  constructor() {
    this.db = open(":memory:");
    this.connection = this.db.connect();
    this.init();
  }

  private async init() {
    try {
      // Install and load httpfs extension for S3 access
      this.connection.query("INSTALL httpfs;");
      this.connection.query("LOAD httpfs;");

      // Configure S3 credentials if available
      const awsAccessKey = Deno.env.get("AWS_ACCESS_KEY_ID");
      const awsSecretKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
      const awsRegion = Deno.env.get("AWS_REGION");
      
      if (awsAccessKey && awsSecretKey && awsRegion) {
        this.connection.query(
          `SET s3_access_key_id='${awsAccessKey}';
           SET s3_secret_access_key='${awsSecretKey}';
           SET s3_region='${awsRegion}';`
        );
      }
      logger.info("DuckDB initialized successfully");
    } catch (error) {
      logger.error(`DuckDB initialization failed: ${error.message}`);
      throw error;
    }
  }

  query<T>(sql: string): T[] {
    try {
      logger.debug(`Executing query: ${sql}`);
      const results: T[] = [];
      
      for (const row of this.connection.stream(sql)) {
        logger.debug('Row:', row);
        results.push(row as T);
      }
      
      return results;
    } catch (error) {
      logger.error(`DuckDB query failed: ${error.message}`);
      throw error;
    }
  }

  close() {
    try {
      this.connection.close();
      this.db.close();
    } catch (error) {
      logger.error(`DuckDB closing failed: ${error.message}`);
    }
  }
}

export const duckdb = new DuckDBService();