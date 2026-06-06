import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
  categoryId: Joi.string().uuid().required(),
  allergens: Joi.string().allow("").optional(),
  description: Joi.string().required(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number().positive(),
  categoryId: Joi.string().uuid(),
  allergens: Joi.string().allow(""),
  description: Joi.string(),
}).min(1);
