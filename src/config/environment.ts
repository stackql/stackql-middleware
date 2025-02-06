// config/environment.ts
export const config = {
    server: {
      host: Deno.env.get('HOST') || '0.0.0.0',
      port: Number(Deno.env.get('PORT')) || 8080,
    },
    database: {
      host: Deno.env.get('DB_HOST') || 'localhost',
      port: Number(Deno.env.get('DB_PORT')) || 5444,
      name: 'stackql',
      user: 'stackql',
    },
    logging: {
      level: Deno.env.get('LOGLEVEL') || 'INFO'
    }
  };
