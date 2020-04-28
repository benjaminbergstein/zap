import { getAttributeValue, shuffle } from '../utils'
import fs from 'fs'
import util from 'util'

import {
  PrismaClient,
  Game,
  GameAttributeClient,
  GameAttribute,
  Card,
  CardAttribute,
  CardAttributeClient,
} from "@prisma/client"
import { Attribute, CardDefinition, CreateGameArgs, Template } from '../createGame/types'

const readFile = util.promisify(fs.readFile)
const prisma = new PrismaClient()

interface GenerateCardDefinition {
  generationPolicy: string
  templateFields: Array<string>
  [field: string]: any
}

const generateCardDefinitions: (
  template: string,
  cardDefinition: GenerateCardDefinition
) => Promise<CardDefinition[]> = async (template, cardDefinition) => {
  const { generationPolicy, templateFields, ...definition } = cardDefinition
  const [_, fn, ...args] = generationPolicy.match(/^([^:]+):([^,]{1,})(?:,([^,]{1,})){0,}$/) as Array<string>
  const [count, filename] = args
  const listPath = `${process.cwd()}/template/cards/${template}/${filename}`
  const content: string = (''+(await readFile(listPath))).replace(/\n$/, '')
  const list: string[] = shuffle(content.split("\n")).slice(0, count)

  return list.map((item, index) => {
    return templateFields.reduce((def, fieldName) => {
      return {
        ...def,
        [fieldName]: def[fieldName].replace("{item}", item).replace('{n}', index)
      }
    }, definition)
  })
}

const generateCards: (
  gameId: number,
  template: string,
  defaultCard: CardDefinition,
  cardDefinition: CardDefinition
) => Promise<Card[]> = async (gameId, template, defaultCard, cardDefinition) => {
  const { slug, generationPolicy } = cardDefinition
  const cardDefinitions = generationPolicy ?
    await generateCardDefinitions(
      template,
      cardDefinition as GenerateCardDefinition
    ) : [cardDefinition]
  const cards = await generateCardsFromDefinitions(gameId, slug, defaultCard, cardDefinitions)
  return cards
}

const createCard: (
  gameId: number,
  slug: string,
) => Promise<Card> = async (gameId, slug) => await prisma.card.create({
  data: {
    game: { connect: { id: gameId } },
    slug,
  },
})

const createCardAttribute: (
  cardId: number,
  name: string,
  value: string
) => Promise<CardAttribute> = async (cardId, name, value) => prisma.cardAttribute.create({
  data: {
    card: { connect: { id: cardId } },
    name,
    value,
  },
})

const createCardWithAttributes: (
  gameId: number,
  slug: string,
  cardDefinition: CardDefinition,
) => Promise<Card> = async (gameId, slug, cardDefinition) => {
  const card = await createCard(gameId, slug)

  const cardAttributes: Promise<CardAttribute[]> = Promise.all(
    Object.entries(cardDefinition).map(
      ([name, value]) => createCardAttribute(card.id, name, value)
    )
  )

  await cardAttributes

  return card
}

const generateCardsFromDefinitions: (
  gameId: number,
  slug: string,
  defaultCard: CardDefinition,
  cardDefinitions: CardDefinition[],
) => Promise<Card[]> = async (gameId, slug, defaultCard, cardDefinitions) => {
  const cards: Card[] = await Promise.all(
    cardDefinitions.map((cardDefinition) => createCardWithAttributes(
      gameId,
      slug,
      { ...defaultCard, ...cardDefinition }
    ))
  )

  return cards
}

export default generateCards
