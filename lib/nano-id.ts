import { customAlphabet } from 'nanoid'


export const genPostNid = (length: number = 5) => {
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', length)

  return nanoid(length);
}