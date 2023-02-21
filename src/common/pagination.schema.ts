import Joi from 'joi'

const filter = Joi.object({
  operator: Joi.string(),
  value: Joi.any(),
})

const start_date = Joi.date()
const end_date = Joi.date()
const take = Joi.number()
const skip = Joi.number()
const filters = Joi.object().pattern(Joi.string(), filter)
const sorts = Joi.object().pattern(Joi.string(), Joi.string())
const offset = Joi.number()

export const paginationSchema = Joi.object({
  start_date,
  end_date,
  take,
  skip,
  filters,
  sorts,
  offset,
})
