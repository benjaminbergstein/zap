import fs from 'fs'
import {
  PrismaClient,
  Game,
  GameAttributeClient,
  GameAttribute,
  Card,
  CardAttribute,
  CardAttributeClient,
} from "@prisma/client"
import { Attribute, CardDefinition, CreateGameArgs, Template } from './types'
import generateCards from '../generateCards'
import { getAttributeValue } from '../utils'

const prisma = new PrismaClient()

const getTemplateData: (templateType: string, template: string, subType?: string | undefined) => Promise<string> =
  (templateType, template, subType = undefined) => new Promise((res) => {
    const templateLocation = `${process.cwd()}/template/${templateType}/${template}${subType ? `/${subType}` : ''}.json`
    fs.readFile(templateLocation, (err, data) => {
      // Why `''+data`? Typescript requires Buffer coerced to String for
      // JSON.parse().
      //
      res(''+data)
    })
  })

const loadGameTemplate: (template: string) => Promise<Attribute[]> = async (template) => {
  const content = await getTemplateData('game', template)
  return JSON.parse(content)
}

const loadCardDefaultsTemplate: (template: string) => Promise<CardDefinition> = async (template) => {
  const content = await getTemplateData('cards', template, 'defaults')
  return JSON.parse(content)
}

const loadCardDefinitionsTemplate: (template: string) => Promise<CardDefinition[]> = async (template) => {
  const content = await getTemplateData('cards', template, 'definitions')
  return JSON.parse(content)
}

const createGame: (args: CreateGameArgs) => Promise<Game> = async ({ userId, template, title }) => {
  const game = await prisma.game.create({
    data: {
      creator: {
        connect: { id: userId },
      },
      title,
    },
  })

  const gameAttributesPromise = createGameAttributes(game, template)
  const gameAttributes = await gameAttributesPromise

  const cards: Promise<Card[]> = createCards(game, gameAttributes)
  await cards

  return game
}

const createGameAttributes: (game: Game, template: string) => Promise<GameAttribute[]> = async (game, template) => {
  const templateData: Attribute[] = await loadGameTemplate(template)

  const gameAttributeFactory: (attribute: Attribute) => GameAttributeClient<GameAttribute> =
    ({ name, value }) => prisma.gameAttribute.create({
      data: {
        name,
        value,
        game: {
          connect: {
            id: game.id,
          }
        }
      },
    })

  const gameAttributes: GameAttributeClient<GameAttribute>[] = templateData.map(gameAttributeFactory)

  return Promise.all(gameAttributes)
}

// const createCard: (
//   gameId: number,
//   defaultCard: CardDefinition,
//   cardDefinition: CardDefinition
// ) => Promise<Card[]> = async (gameId, defaultCard, cardDefinition) => {
//   const { slug, generationPolicy } = cardDefinition

//   const createCardAttribute: (
//     name: string,
//     value: string
//   ) => Promise<CardAttribute> = (name, value) => {
//     return prisma.cardAttribute.create({
//       data: {
//         card: { connect: { id: card.id } },
//         name,
//         value,
//       },
//     })
//   })

//   if (generationPolicy) {
//     const [_, fn, ...args] = generationPolicy.match(/^([^:]+):([^,]{1,})(?:,([^,]{1,})){0,}$/)
//     console.log(fn, args)
//     throw 'foo'
//   } else {
//     const cardDefinitions = [cardDefinitions]
//   }

//   const createCardFromDefinition: (slug: string, cardDefinition: CardDefinition) => Promise<Card> = async (cardDefinition) => {
//     const card = await prisma.card.create({
//       data: {
//         game: { connect: { id: gameId } },
//         slug,
//       },
//     })

//     const cardAttributes = Promise.all(Object.entries({ ...defaultCard, ...cardDefinition })
//       .map(([name, value]) => createCardAttribute(name, value))
//     await cardAttributes
//     return Promise.resolve(card)
//   }

//   return Promise.all(cardDefinitions.map((cardDefinitions) => createCardFromDefinitions(slug, cardDefinitions)))
// }

const createCards: (game: Game, gameAttributes: GameAttribute[]) => Promise<Card[]> = async (game, gameAttributes) => {
  const deckAttribute = getAttributeValue(gameAttributes, 'deck')
  const template = deckAttribute.value
  const defaultCard: CardDefinition = await loadCardDefaultsTemplate(template)
  const cardDefinitions: CardDefinition[] = await loadCardDefinitionsTemplate(template)

  const reducer: (cardDefinition: CardDefinition) => Promise<Card[]> =
    (cardDefinition) => {
      return generateCards(game.id, template, defaultCard, cardDefinition)
    }

  const cards: Card[] = (await Promise.all(cardDefinitions.map(reducer))).flat()

  return cards
}

export default createGame
