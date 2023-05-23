export const getRandomInRange = (): number => {
  const randomNumber = Math.floor(Math.random() * 1000000)
  const code = randomNumber.toString().padEnd(6, '0')
  return Number(code)
}
