export const sortByGapToLeader = (a, b) => {
  if (a.timing?.gapToLeader === '') return -1
  if (b.timing?.gapToLeader === '') return 1
  return parseFloat(a.timing?.gapToLeader?.replace("+", "")) - parseFloat(b.timing?.gapToLeader?.replace("+", ""))
}

export const sortByPosition = (a, b) => {
  if ((a.timing?.position === b.timing?.position) || !a.timing?.position || !b.timing?.position) {
    return sortByGapToLeader(a, b)
  }
  return parseInt(a.timing?.position) - parseInt(b.timing?.position)
}

export const getFastestLap = (currentData) => {
  return Object.values(currentData ?? {}).reduce((acc, next) => next.timing?.bestLapTime?.value !== "" && next.timing?.bestLapTime?.value < acc ? next.timing?.bestLapTime?.value : acc, "99:99.99")
}

export const calculatePosition = (currentData, racingNumber) => {
  const timingPosition = currentData[racingNumber]?.timing?.position
  if (timingPosition !== '0') return timingPosition;
  return Object
    .entries(currentData)
    .sort((a, b) => sortByPosition(a[1], b[1]))
    .findIndex(i => i[0] === racingNumber) + 1
}
