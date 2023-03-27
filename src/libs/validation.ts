import slug from 'slug'

export const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
export const uuidV1Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export const uuidV2Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[2][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export const uuidV3Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[3][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export const uuidV5Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i


export const isEmail = (input: string) => input.length < 320 && emailRegex.test(input)
export const isUUIDV1 = (input: string) => uuidV1Regex.test(input)
export const isUUIDV2 = (input: string) => uuidV2Regex.test(input)
export const isUUIDV3 = (input: string) => uuidV3Regex.test(input)
export const isUUIDV4 = (input: string) => uuidV4Regex.test(input)
export const isUUIDV5 = (input: string) => uuidV5Regex.test(input)

export const isType = (value:string, type) => Object.values<string>(type).includes(value) ? value : false

export const isSlug = (value:string|undefined) => value == undefined ? false : slug(value) == value
