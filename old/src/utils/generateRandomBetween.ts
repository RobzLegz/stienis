export function getRandomNumber(min: number, max: number) {
  const randomFraction = Math.random();

  const randomInRange = randomFraction * (max - min) + min;

  return Math.round(randomInRange);
}
