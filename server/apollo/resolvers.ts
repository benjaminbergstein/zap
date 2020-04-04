import fs from 'fs'
import jwt from 'jsonwebtoken'
import { PrismaClient, Player } from "@prisma/client"

const { SECRET: Secret } = process.env as any
const prisma = new PrismaClient()

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

interface Attribute {
  name: string
  value: string
}

interface CreateGameAttributeInput {
  gameId: number
  name: string
  value: string
}

interface GameIdFilter {
  gameId: number
}

interface TokenContent {
  id: number
}

const authenticateToken: (token: string) => number = (token) => {
  const { id } = jwt.verify(token, Secret) as any
  return id
}

const generateToken: (id: number) => string = (id) => jwt.sign({ id }, Secret)

const loadTemplate: (template: string) => Promise<Attribute[]> = (template) => new Promise((res) => {
  fs.readFile(`${process.cwd()}/template/game/${template}.json`, (err, data) => {
    res(JSON.parse(''+data))
  })
})

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

    gameAttributes: async (parent: any, args: GameIdFilter) => {
      const gameAttributes = await prisma.gameAttribute.findMany({
        where: { game: { id: args.gameId } },
      })
      return gameAttributes
      // gameAttribute.findMany({ where: { games: { every: { id: { equals: args.gameId } } } } })
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
      const game = await prisma.game.create({
        data: {
          creator: {
            connect: { id: userId },
          },
          title,
        },
      })

      const templateData: Attribute[] = await loadTemplate(template)
      const createGameAttributes = Promise.all(templateData.map(({ name, value }) => prisma.gameAttribute.create({
        data: {
          name,
          value,
          game: {
            connect: {
              id: game.id,
            }
          }
        },
      })))

      await createGameAttribute

      return game
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
