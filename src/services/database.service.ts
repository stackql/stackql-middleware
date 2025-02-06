// services/database.service.ts
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { config } from "../config/environment.ts";
import { logger } from "./logger.service.ts";

class DatabaseService {
  private client: Client;

  constructor() {
    this.client = new Client({
      applicationName: 'stackql',
      hostname: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      logger.info(`Connected to stackql server at ${config.database.host}:${config.database.port}`);
    } catch (error) {
      logger.error(`Failed to connect to stackql server: ${error.message}`);
      throw error;
    }
  }

  async query<T>(sql: string): Promise<T[]> {
    const result = await this.client.queryObject<T>(sql);
    return result.rows;
  }
}

export const db = new DatabaseService();