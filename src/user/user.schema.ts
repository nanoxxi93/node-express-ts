import Joi from 'joi'

const id = Joi.number()
const username = Joi.string()
const password = Joi.string()
const firstname = Joi.string()
const lastname = Joi.string()
const status = Joi.string()
const role = Joi.string().valid(...['SUPERADMIN', 'ADMIN', 'SUPERVISOR'])

export const createSchema = Joi.object({
  username: username.required(),
  password: password.required(),
  firstname: firstname.required(),
  lastname,
  status,
  role: role.required(),
})

export const updateSchema = Joi.object({
  id: id.required(),
  password: password.required(),
  firstname,
  lastname,
  status,
  role: role.required(),
})

export const getSchema = Joi.object({
  id: id.required(),
})
