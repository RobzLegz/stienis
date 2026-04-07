export function randomInteger(min: number, max: number) {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);

  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}
