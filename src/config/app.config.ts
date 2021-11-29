import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    environment: process.env.NODE_ENV || 'development',
    app: {
      port: parseInt(process.env.PORT, 10) || 8080,
      selfApiUrl: process.env.SELF_API_URL,
    },
    database: {
      url: process.env.DATABASE_URL,
      log: process.env.DATABASE_LOG || 'yes',
    },
    acl: {
      companyUid: process.env.BASIC_ACL_COMPANY_UID,
      accessKey: process.env.BASIC_ACL_ACCESS_KEY,
    },
  };
});
