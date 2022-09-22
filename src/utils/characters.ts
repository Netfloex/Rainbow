const letters = "abcdefghijklmnopqrstuvwxyz" as const
const upperCaseLetters = letters.toUpperCase() as Uppercase<typeof letters>
const numbers = "0123456789" as const
const symbols = "!@#$%^&*_-+=<>?,./:;\"'[]{}|\\€ \n\t" as const

export const characters = letters + upperCaseLetters + numbers + symbols
