export const nearestPercent = (total, givenValue, interval) => {
  const valuePercentage = (givenValue / total) * 100
  return Math.floor(valuePercentage / interval) * interval
}
