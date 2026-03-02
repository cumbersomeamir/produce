export function calculateCustomsDuty({ cif = 0, bcdRate = 10, swsRate = 10, igstRate = 18 }) {
  const basicDuty = (Number(cif) * Number(bcdRate)) / 100;
  const sws = (basicDuty * Number(swsRate)) / 100;
  const taxable = Number(cif) + basicDuty + sws;
  const igst = (taxable * Number(igstRate)) / 100;

  return {
    basicDuty,
    sws,
    igst,
    totalDuty: basicDuty + sws + igst,
  };
}
