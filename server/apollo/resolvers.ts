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
    }
  }
}
