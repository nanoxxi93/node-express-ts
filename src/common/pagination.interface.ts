import { getLocalTodayString, getLocalTomorrowString } from './helper'

interface Filter {
  operator: string
  value: any
}

interface XFilter {
  [key: string]: Filter
}

interface XSort {
  [key: string]: string
}

export interface PaginationInteface {
  start_date: string
  end_date: string
  take: number
  skip: number
  filters: XFilter
  sorts: XSort
  offset: number
}

export interface DbPaginationInteface {
  start_date?: string
  end_date?: string
  take?: number
  skip?: number
  where?: string
  order?: string
  offset?: number
}

export class DtoDbPaginationSel {
  start_date: string
  end_date: string
  take: number
  skip: number
  where: string
  order: string
  offset: number
  constructor({
    start_date,
    end_date,
    take,
    skip,
    where,
    order,
    offset,
  }: DbPaginationInteface) {
    this.offset = offset || 0
    this.start_date = start_date || getLocalTodayString(this.offset)
    this.end_date = end_date || getLocalTomorrowString(this.offset)
    this.take = take || 20
    this.skip = skip || 0
    this.where = where || ''
    this.order = order || ''
  }
}
