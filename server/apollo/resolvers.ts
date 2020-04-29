import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client"
import createGame from './createGame'
import { Attribute } from './createGame/types'

const prisma = new PrismaClient()
const { SECRET: Secret } = process.env as any

interface SignInArgs {
  name: string
}

interface SignUpArgs {
  name: string
}

interface CreateGameInput {
  title: string
  token: string
  template: string
}

interface CreateGameAttributeInput {
  gameId: number
  name: string
  value: string
}

interface GameIdFilter {
  gameId: number
}

interface SetCardAttributeInput {
  cardId: number
  name: string
  value: string
}

interface CardAttribute {
  name: string
  value: string
}

interface CardFilter extends GameIdFilter {
  location?: string
  attribute?: CardAttribute[]
}

interface CardIdFilter {
  cardIds: number[]
}

interface TokenContent {
  id: number
}

const authenticateToken: (token: string) => number = (token) => {
  const { id } = jwt.verify(token, Secret) as any
  return id
}

const generateToken: (id: number) => string = (id) => jwt.sign({ id }, Secret)

export default {
  Query: {
    games: (parent: any, args: any, context: any, info: any) => {
      const { includePlayers } = args
      return prisma.game.findMany({ include: {
        players: includePlayers,
        creator: includePlayers,
      } })
    },

    players: () => prisma.player.findMany(),

    cardAttributes: async (parent: any, args: CardIdFilter) => {
      const cardIds = args.cardIds.map((cardId) => parseInt(''+cardId))
      const cardAttributes = await prisma.cardAttribute.findMany({
        where: { card: { id: { in: cardIds } } },
      })
      return cardAttributes
    },

    gameCardsWithAttribute: async (parent: any, args: CardFilter) => {
      const { attribute } = args
      const whereCard: any = {}

      if (attribute) {
        whereCard.cardAttributes = { some: attribute }
      }

      const gameId = parseInt(''+args.gameId)
      const cards = await prisma.card.findMany({
        where: {
          ...whereCard,
          game: { id: gameId }
        },
      })
      return cards
    },

    gameCards: async (parent: any, args: CardFilter) => {
      const { location } = args
      const whereCard: any = {}

      if (location) {
        whereCard.cardAttributes = {
          some: { name: "location", value: location },
        }
      }

      const gameId = parseInt(''+args.gameId)
      const cards = await prisma.card.findMany({
        where: {
          ...whereCard,
          game: { id: gameId }
        },
      })
      return cards
    },

    gameAttributes: async (parent: any, args: GameIdFilter) => {
      const gameAttributes = await prisma.gameAttribute.findMany({
        where: { game: { id: +args.gameId } },
      })
      return gameAttributes
    },

    me: async (parent: any, args: any) =>  {
      const id = authenticateToken(args.token)
      return await prisma.player.findOne({ where: { id } })
    }
  },

  Game: {
    creator: (parent: any) => parent.creator,
    players: (parent: any) => parent.players,
  },

  Mutation: {
    signIn: async (parent: any, args: SignInArgs) => {
      const { name } = args
      const players= await prisma.player.findMany({ where: { name } })
      const token = generateToken(players[0].id)
      return { token }
    },

    signUp: async (parent: any, args: SignUpArgs) => {
      const { name } = args
      const user = await prisma.player.create({ data: { name } })
      const token = generateToken(user.id)
      return { token }
    },

    createGame: async (parent: any, args: CreateGameInput) => {
      const { title, token, template } = args
      const userId = authenticateToken(token)
      const game = await createGame({ userId, template, title })
      return game
    },

    setCardAttributeValue: async (parent: any, args: SetCardAttributeInput) => {
      const { cardId: _cardId, name, value } = args
      const cardId = +_cardId
      const existingCardAttribute = (await prisma.cardAttribute.findMany({
        where: { cardId, name },
      }))[0]

      if (existingCardAttribute) {
        return await prisma.cardAttribute.update({
          where: { id: existingCardAttribute.id },
          data: { value },
        })
      }

      return await prisma.cardAttribute.create({
        data: {
          name,
          value,
          card: { connect: { id: cardId } },
        },
      })
    },

    createGameAttribute: async (parent: any, args: CreateGameAttributeInput) => {
      const { name, value, gameId } = args
      return await prisma.gameAttribute.create({
        data: {
          name,
          value,
          game: {
            connect: {
              id: gameId,
            }
          }
        },
      })
    },
  }
}
