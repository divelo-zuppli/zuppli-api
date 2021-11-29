import * as Joi from 'joi';

export default Joi.object({
  /* APP */
  PORT: Joi.required(),
  SELF_API_URL: Joi.string().required(),

  /* DATABASE */
  DATABASE_URL: Joi.string().required(),

  /* BASIC ACL */
  BASIC_ACL_COMPANY_UID: Joi.string().required(),
  BASIC_ACL_ACCESS_KEY: Joi.string().required(),
});
