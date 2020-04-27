import {
  GameAttribute,
} from "@prisma/client"

export const getAttributeValue: (
  gameAttributes: GameAttribute[],
  attributeName: string
) => GameAttribute = (gameAttributes, attributeName) => {
  const attribute = gameAttributes.find(({ name }) => name === attributeName)
  if (!attribute) throw `Attribute not found: ${attributeName}`
  return attribute
}

/**
* Shuffles array in place.
* @param {Array} a items An array containing the items.
*/
export const shuffle: (a: any) => any = (a) => {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
