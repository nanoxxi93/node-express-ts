import Joi from 'joi'

const username = Joi.string().alphanum().min(3).max(30).required()
const password = Joi.string()
  .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
  .required()

export const authSchema = Joi.object({
  username,
  password,
})

export const passwordSchema = Joi.object({
  password,
})
