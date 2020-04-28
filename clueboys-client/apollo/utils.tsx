import { CardAttribute } from './types'

export const getAttributeValue: (
  cardAttributes: CardAttribute[],
  attributeName: string
) => string = (cardAttributes, attributeName) => {
  const attribute = cardAttributes.find(({ name }) => name === attributeName)
  if (!attribute) throw `Attribute not found: ${attributeName}`
  return attribute.value
}
