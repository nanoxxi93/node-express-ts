export interface UserCreateRequestDto {
  username: string
  password: string
  firstname: string
  lastname?: string
  status?: 'ACTIVE' | 'INACTIVE'
  role: 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR'
}

export interface UserUpdateRequestDto extends Partial<UserCreateRequestDto> {
  id: number
  role: 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR'
}
