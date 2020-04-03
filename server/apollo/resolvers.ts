import { PrismaClient, Player } from "@prisma/client"

const prisma = new PrismaClient()

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
  },
  Game: {
    creator: (parent: any) => parent.creator,
    players: (parent: any) => parent.players,
  }
}
