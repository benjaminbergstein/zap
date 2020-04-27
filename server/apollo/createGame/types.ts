export interface Attribute {
  name: string
  value: string
}

export interface CardDefinition {
  [name: string]: string
}

export interface CreateGameArgs {
  userId: number
  template: string
  title: string
}

export type Template = Attribute[] | CardDefinition | CardDefinition[]
