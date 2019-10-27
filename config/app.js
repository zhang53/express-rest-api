require('dotenv').config();
let environment = process.env;

module.exports = {
    nodeEnv: environment.NODE_ENV,
    appName: environment.APP_NAME,
    appPort: parseInt(environment.APP_PORT) || 8000,
    siteUrl: environment.SITE_URL,
    dbUrl: environment.DB_URL,
    jwt: {
        secret: environment.JWT_SECRET,
        ttl: parseInt(environment.JWT_TTL),
        refreshSecret: environment.JWT_REFRESH_SECRET,
        refreshTtl: parseInt(environment.JWT_REFRESH_TTL)
    },
    smtp: {
        host: environment.SMTP_HOST,
        port: parseInt(environment.SMTP_PORT),
        secure: environment.SMTP_SECURE,
        username: environment.SMTP_USERNAME,
        password: environment.SMTP_PASSWORD,
        from: `${environment.APP_NAME} <${environment.SMTP_USERNAME}>`
    }
};
