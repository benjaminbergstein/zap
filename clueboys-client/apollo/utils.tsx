import { CardAttribute } from './types'

export const doesCardAttributeExist: (
  gameAttributes: CardAttribute[] | undefined,
  attributeName: string,
  defaultValue?: string
) => boolean = (gameAttributes, attributeName) => {
  if (!gameAttributes) return false

  const attribute = gameAttributes.find(({ name }) => name === attributeName)
  return !!attribute
}

export const getAttributeValue: (
  gameAttributes: CardAttribute[] | undefined,
  attributeName: string,
  defaultValue?: string
) => string = (gameAttributes, attributeName, defaultValue = '') => {
  if (!gameAttributes) return defaultValue

  const attribute = gameAttributes.find(({ name }) => name === attributeName)
  if (!attribute) return defaultValue
  return attribute.value
}
