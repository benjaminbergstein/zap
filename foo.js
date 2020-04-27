const numbers = "A 2 3 4 5 6 7 8 9 10 J Q K".split(" ")
const suits = ["hearts", "spades", "diamond", "clubs"]

const text = {
  hearts: "Hearts",
  spades: "Spades",
  diamond: "Diamond",
  clubs: "Clubs",
}

const cards = suits.map((suit) => numbers.map((number) => ({
    slug: `${number.toLowerCase()}-${suit}`,
    name: `${number} of ${text[suit]}`,
    number,
    suit,
})))

console.log(JSON.stringify(cards, null, 2))
