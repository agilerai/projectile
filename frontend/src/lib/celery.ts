const celery = require("celery-node");

const UPSTASH_REDIS_PASSWORD=process.env.UPSTASH_REDIS_PASSWORD;
const UPSTASH_REDIS_HOST=process.env.UPSTASH_REDIS_HOST;
const UPSTASH_REDIS_PORT=process.env.UPSTASH_REDIS_PORT;


const connection_link = `rediss://:${UPSTASH_REDIS_PASSWORD}@${UPSTASH_REDIS_HOST}:${UPSTASH_REDIS_PORT}?ssl_cert_reqs=required`;
console.log(connection_link);
export const celeryClient = celery.createClient(
    connection_link,
    connection_link
);

