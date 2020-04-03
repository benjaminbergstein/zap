import { PrismaClient, Player } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const alicePlayer: Player | null = await prisma.player.findOne({ where: { id: 1 } })

  if (alicePlayer) {
    const { id: aliceId } = alicePlayer
    await prisma.game.create({
      data: {
        title: 'Hello Game',
        creator: { connect: { id: aliceId }},
        players: { connect: [{ id: aliceId }] },
      },
    })
    const allGames = await prisma.game.findMany()
    console.log(allGames)
  }
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.disconnect()
  })
