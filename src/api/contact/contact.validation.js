import Joi from "joi";

export const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  subject: Joi.string().allow("").optional(),
  message: Joi.string().min(10).required(),
});
