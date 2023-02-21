import { DbError } from '../db/common.interface'
import logger from '../libs/winston'
import paginationColumns from './pagination.columns'

const cleanKeys = ['datas']

const cleanObject = (data: any) => {
  const dataTemp = JSON.parse(JSON.stringify(data))
  try {
    for (const k in dataTemp) {
      if (dataTemp.hasOwnProperty(k) && cleanKeys.includes(k)) {
        if (typeof dataTemp[k] === 'string') {
          dataTemp[k] = dataTemp[k].slice(0, 1000)
        }
      }
    }
  } catch (error) {}
  return dataTemp
}

export const logClean = (data: any | any[]) => {
  const dataTemp = JSON.parse(JSON.stringify(data))
  try {
    if (dataTemp instanceof Object) {
      return cleanObject(dataTemp)
    } else if (dataTemp instanceof Array) {
      return dataTemp.reduce((ac, x) => [...ac, { ...cleanObject(x) }], [])
    } else if (typeof dataTemp === 'string' && dataTemp.length > 1000) {
      return dataTemp.slice(0, 1000)
    }
  } catch (error) {}
  return dataTemp
}

export const logErrorService = ({
  _requestid,
  error,
}: {
  _requestid: string
  error: any
}) => {
  if (error instanceof Error || error instanceof DbError) {
    logger.warn(error.message, {
      _requestid: _requestid,
      error: {
        code: 'SERVICE',
        stack: error?.stack,
      },
    })
  }
}

export const jsonStringify = (data: any) => {
  if (typeof data === 'string') {
    try {
      JSON.parse(data)
    } catch (e) {
      return null
    }
    return data
  } else {
    try {
      return JSON.stringify(data)
    } catch (e) {
      return null
    }
  }
}

export const getLocalTodayDate = (offset: number = 0) => {
  return new Date(new Date().setHours(new Date().getHours() + offset))
}

export const getLocalTodayString = (offset: number = 0) => {
  return getLocalTodayDate(offset).toISOString().slice(0, 10)
}

export const getLocalTomorroDate = (offset: number = 0) => {
  return new Date(
    getLocalTodayDate(offset).setDate(getLocalTodayDate(offset).getDate() + 1),
  )
}

export const getLocalTomorrowString = (offset: number = 0) => {
  return getLocalTomorroDate(offset).toISOString().slice(0, 10)
}

const paginationWhereNumber = ({
  operator,
  column,
  value,
}: {
  operator: string
  column: string
  value: string
}) => {
  switch (operator) {
    case 'greater':
      return ` and ${column} > ${value}`
    case 'greaterequal':
    case 'greaterorequals':
      return ` and ${column} >= ${value}`
    case 'smaller':
    case 'less':
      return ` and ${column} < ${value}`
    case 'smallerequal':
    case 'lessorequals':
      return ` and ${column} <= ${value}`
    case 'isnull':
      return ` and ${column} is null`
    case 'isnotnull':
      return ` and ${column} is not null`
    case 'noequals':
    case 'notequals':
      return ` and ${column} <> ${value}`
    case 'equals':
      return ` and ${column} = ${value}`
  }
  return ''
}

const paginationWhereDatestr = ({
  operator,
  column,
  value,
}: {
  operator: string
  column: string
  value: string
}) => {
  switch (operator) {
    case 'after':
      return ` and (${column})::DATE > '${value}'::DATE`
    case 'afterequals':
      return ` and (${column})::DATE >= '${value}'::DATE`
    case 'before':
      return ` and (${column})::DATE < '${value}'::DATE`
    case 'beforeequals':
      return ` and (${column})::DATE <= '${value}'::DATE`
    case 'isnull':
      return ` and ${column} is null`
    case 'isnotnull':
      return ` and ${column} is not null`
    case 'notequals':
      return ` and (${column})::DATE <> '${value}'::DATE`
    case 'equals':
      return ` and (${column})::DATE = '${value}'::DATE`
  }
  return ''
}

const paginationWhereDate = ({
  operator,
  column,
  value,
  offset,
}: {
  operator: string
  column: string
  value: string
  offset: number
}) => {
  switch (operator) {
    case 'after':
      return column.includes('p_offset')
        ? ` and (${column})::DATE > '${value}'::DATE`
        : ` and ${column} > '${value}'::DATE + INTERVAL '1DAY' - ${offset} * INTERVAL '1HOUR'`
    case 'afterequals':
      return column.includes('p_offset')
        ? ` and (${column})::DATE >= '${value}'::DATE`
        : ` and ${column} >= '${value}'::DATE - ${offset} * INTERVAL '1HOUR'`
    case 'before':
      return column.includes('p_offset')
        ? ` and (${column})::DATE < '${value}'::DATE`
        : ` and ${column} < '${value}'::DATE - ${offset} * INTERVAL '1HOUR'`
    case 'beforeequals':
      return column.includes('p_offset')
        ? ` and (${column})::DATE <= '${value}'::DATE`
        : ` and ${column} <= '${value}'::DATE + INTERVAL '1DAY' - ${offset} * INTERVAL '1HOUR'`
    case 'isnull':
      return ` and ${column} is null`
    case 'isnotnull':
      return ` and ${column} is not null`
    case 'notequals':
      return column.includes('p_offset')
        ? ` and (${column})::DATE <> '${value}'::DATE`
        : ` and (${column} + ${offset} * INTERVAL '1HOUR')::DATE <> '${value}'::DATE`
    case 'equals':
      return column.includes('p_offset')
        ? ` and (${column})::DATE = '${value}'::DATE`
        : ` and (${column} + ${offset} * INTERVAL '1HOUR')::DATE = '${value}'::DATE`
  }
  return ''
}

const paginationWhereDateTime = ({
  operator,
  column,
  value,
  offset,
}: {
  operator: string
  column: string
  value: string
  offset: number
}) => {
  switch (operator) {
    case 'after':
      return column.includes('p_offset')
        ? ` and (${column})::TIMESTAMP > ('${value}')::TIMESTAMP`
        : ` and ${column} > ('${value}' + INTERVAL '1DAY')::TIMESTAMP - ${offset} * INTERVAL '1HOUR'`
    case 'afterequals':
      return column.includes('p_offset')
        ? ` and (${column})::TIMESTAMP >= ('${value}')::TIMESTAMP`
        : ` and ${column} >= ('${value}')::TIMESTAMP - ${offset} * INTERVAL '1HOUR'`
    case 'before':
      return column.includes('p_offset')
        ? ` and (${column})::TIMESTAMP < ('${value}')::TIMESTAMP`
        : ` and ${column} < ('${value}')::TIMESTAMP - ${offset} * INTERVAL '1HOUR'`
    case 'beforeequals':
      return column.includes('p_offset')
        ? ` and (${column})::TIMESTAMP <= ('${value}')::TIMESTAMP`
        : ` and ${column} <= ('${value}' + INTERVAL '1DAY')::TIMESTAMP - ${offset} * INTERVAL '1HOUR'`
    case 'isnull':
      return ` and ${column} is null`
    case 'isnotnull':
      return ` and ${column} is not null`
    case 'notequals':
      return column.includes('p_offset')
        ? ` and DATE_TRUNC('MINUTE', (${column})::TIMESTAMP) <> ('${value}')::TIMESTAMP`
        : ` and DATE_TRUNC('MINUTE', (${column})::TIMESTAMP) <> (('${value}')::TIMESTAMP - ${offset} * INTERVAL '1HOUR')::TIMESTAMP`
    case 'equals':
      return column.includes('p_offset')
        ? ` and DATE_TRUNC('MINUTE', (${column})::TIMESTAMP) = ('${value}')::TIMESTAMP`
        : ` and DATE_TRUNC('MINUTE', (${column})::TIMESTAMP) = (('${value}')::TIMESTAMP - ${offset} * INTERVAL '1HOUR')::TIMESTAMP`
  }
  return ''
}

const paginationWhereTime = ({
  operator,
  column,
  value,
}: {
  operator: string
  column: string
  value: string
}) => {
  switch (operator) {
    case 'after':
      return ` and ${column}::INTERVAL > ('${value}')::INTERVAL`
    case 'afterequals':
      return ` and ${column}::INTERVAL >= ('${value}')::INTERVAL`
    case 'before':
      return ` and ${column}::INTERVAL < ('${value}')::INTERVAL`
    case 'beforeequals':
      return ` and ${column}::INTERVAL <= ('${value}')::INTERVAL`
    case 'isnull':
      return ` and ${column} is null`
    case 'isnotnull':
      return ` and ${column} is not null`
    case 'notequals':
      return ` and ${column}::INTERVAL <> ('${value}')::INTERVAL`
    case 'equals':
      return ` and ${column}::INTERVAL = ('${value}')::INTERVAL`
  }
  return ''
}

const paginationWhereBoolean = ({
  operator,
  column,
}: {
  operator: string
  column: string
}) => {
  switch (operator) {
    case 'istrue':
      return ` and ${column} = true`
    case 'isfalse':
      return ` and ${column} = false`
    case 'isnull':
      return ` and ${column} is null`
    case 'isnotnull':
      return ` and ${column} is not null`
  }
  return ''
}

const paginationWhereString = ({
  operator,
  column,
  value,
}: {
  operator: string
  column: string
  value: string
}) => {
  switch (operator) {
    case 'equals':
      return ` and ${column} = '${value}'`
    case 'noequals':
    case 'notequals':
      return ` and ${column} <> '${value}'`
    case 'empty':
    case 'isempty':
      return ` and (${column} = '' or ${column} is null)`
    case 'noempty':
    case 'isnotempty':
      return ` and ${column} <> '' and ${column} is not null`
    case 'isnull':
      return ` and ${column} is null`
    case 'isnotnull':
      return ` and ${column} is not null`
    case 'nocontains':
    case 'notcontains':
      return ` and ${column} not ilike '%${value}%'`
    case 'contains':
      return ` and ${column} ilike '%${value}%'`
    case 'greater':
      return ` and ${column} > ${value}`
    case 'greaterequal':
    case 'greaterorequals':
      return ` and ${column} >= ${value}`
    case 'smaller':
    case 'less':
      return ` and ${column} < ${value}`
    case 'smallerequal':
    case 'lessorequals':
      return ` and ${column} <= ${value}`
  }
  return ''
}

export const paginationFilter = ({
  filters,
  origin,
  offset,
}: {
  filters: {
    [key: string]: { value: any; operator: string }
  }
  origin: string
  offset: number
}) => {
  let where = ''
  for (const [key, filter] of Object.entries(filters)) {
    if (filter) {
      const { column, type } = paginationColumns[origin][key]
      if (
        filter.value ||
        [
          'empty',
          'isempty',
          'noempty',
          'isnotempty',
          'isnull',
          'isnotnull',
        ].includes(filter.operator)
      ) {
        switch (type) {
          case 'json':
            where += ` and ${column.replace('###JVALUE###', filter.value)}`
            break
          case 'number':
            where += paginationWhereNumber({ column, ...filter })
            break
          case 'datestr':
            where += paginationWhereDatestr({ column, ...filter })
            break
          case 'date':
            where += paginationWhereDate({ column, ...filter, offset })
            break
          case 'datetime':
            where += paginationWhereDateTime({ column, ...filter, offset })
            break
          case 'time':
            where += paginationWhereTime({ column, ...filter })
            break
          case 'boolean':
            where += paginationWhereBoolean({ column, ...filter })
            break
          case 'string':
          default:
            where += paginationWhereString({ column, ...filter })
            break
        }
      }
    }
  }
  return where.replace(/###OFFSET###/gi, offset.toString())
}

export const paginationOrder = ({
  sorts,
  origin,
}: {
  sorts: {
    [key: string]: string
  }
  origin: string
}) => {
  let order = []
  for (const [key, value] of Object.entries(sorts)) {
    if (value) {
      const { column } = paginationColumns[origin][key]
      order.push(`${column} ${value}`)
    }
  }
  return ' ' + order.join(', ')
}
