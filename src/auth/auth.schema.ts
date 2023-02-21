import Joi from 'joi'

const username = Joi.string().required()
const password = Joi.string().required()

export const authSchema = Joi.object({
  username,
  password,
})

export const passwordSchema = Joi.object({
  password,
})
