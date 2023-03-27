import { Infer, object, string } from 'superstruct'
import { Email } from '@libs/superstruct.defines'

export const UserSecurity = object({
    email: Email,
    password: string(),
})
export type UserSecurityType = Infer<typeof UserSecurity>;
