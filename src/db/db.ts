import { pgconnect } from 'https://raw.githubusercontent.com/kagis/pgwire/main/mod.js';

const env = Deno.env.toObject()
const DB_HOST = env.DB_HOST || 'localhost'
const DB_PORT = env.DB_PORT || 5444
const DB_DEBUG = env.DB_DEBUG || false

// const sslrootcert = await Deno.readTextFile('./creds/server_cert.pem');

export const connect = async () => {
    const conn = await pgconnect({
        hostname: DB_HOST,
        port: DB_PORT,
        _debug: DB_DEBUG,
        application_name: 'stackql',
        // sslmode: 'require',
        // sslrootcert: sslrootcert,
    });
    return conn;
}