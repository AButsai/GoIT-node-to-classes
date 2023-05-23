export interface UpdateUserDto {
  subscription?: string
  avatarURL?: string
  verify?: boolean
  verificationCode?: string | null
}
