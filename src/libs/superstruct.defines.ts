import { define, pattern, string } from 'superstruct'
import { emailRegex, isSlug } from './validation'

export const Email = pattern(string(), emailRegex)
export const Slug = define<string>('url-safe-string', isSlug)
