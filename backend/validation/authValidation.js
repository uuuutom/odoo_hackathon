import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),

  username: Joi.string().min(3).max(30).required(),

  email: Joi.string().email().required(),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$"))
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),
});
