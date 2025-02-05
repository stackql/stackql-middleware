// controllers/meta.controller.ts
import { Context } from "../types/context.types.ts";
import { db } from "../services/database.service.ts";
import { logger } from "../services/logger.service.ts";

export async function getProviders(ctx: Context) {
  try {
    const rows = await db.query('SHOW PROVIDERS');
    ctx.response.body = { data: rows };
  } catch (error) {
    logger.error(`Failed to get providers: ${error.message}`);
    ctx.response.status = 400;
    ctx.response.body = { error: error.message };
  }
}

export async function getServices(ctx: Context) {
  try {
    const { provider } = ctx.params;
    const filter = ctx.request.url.searchParams.get('name') ? 
      ` LIKE '${ctx.request.url.searchParams.get('name')}'` : '';
    
    const rows = await db.query(`SHOW EXTENDED SERVICES IN ${provider}${filter}`);
    ctx.response.body = { data: rows };
  } catch (error) {
    logger.error(`Failed to get services: ${error.message}`);
    ctx.response.status = 400;
    ctx.response.body = { error: error.message };
  }
}

export async function getResources(ctx: Context) {
  try {
    const { provider, service } = ctx.params;
    const filter = ctx.request.url.searchParams.get('name') ? 
      ` LIKE '${ctx.request.url.searchParams.get('name')}'` : '';
    
    const rows = await db.query(
      `SHOW EXTENDED RESOURCES IN ${provider}.${service}${filter}`
    );
    ctx.response.body = { data: rows };
  } catch (error) {
    logger.error(`Failed to get resources: ${error.message}`);
    ctx.response.status = 400;
    ctx.response.body = { error: error.message };
  }
}

export async function getResourceDetails(ctx: Context) {
  try {
    const { provider, service, resource } = ctx.params;
    const rows = await db.query(
      `DESCRIBE EXTENDED ${provider}.${service}.${resource}`
    );
    ctx.response.body = { data: rows };
  } catch (error) {
    logger.error(`Failed to get resource details: ${error.message}`);
    ctx.response.status = 400;
    ctx.response.body = { error: error.message };
  }
}

export async function getResourceMethods(ctx: Context) {
  try {
    const { provider, service, resource } = ctx.params;
    const rows = await db.query(
      `SHOW EXTENDED METHODS IN ${provider}.${service}.${resource}`
    );
    ctx.response.body = { data: rows };
  } catch (error) {
    logger.error(`Failed to get resource methods: ${error.message}`);
    ctx.response.status = 400;
    ctx.response.body = { error: error.message };
  }
}