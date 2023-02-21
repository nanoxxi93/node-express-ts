interface PaginationColumns {
  [key: string]: TableKey
}

interface TableKey {
  [key: string]: Column
}

interface Column {
  column: string
  type?:
    | 'string'
    | 'number'
    | 'boolean'
    | 'datestr'
    | 'datetime'
    | 'date'
    | 'time'
    | 'json'
}

const paginationColumns: PaginationColumns = {
  user: {
    id: {
      column: 'id',
      type: 'number',
    },
    username: {
      column: 'username',
    },
    firstname: {
      column: 'firstname',
    },
    status: {
      column: 'status',
    },
    role: {
      column: 'role_description',
    },
  },
}

export default paginationColumns
