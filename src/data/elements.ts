import tableData from "periodic-table-data/periodicTableData.json";
import type { ElementRecord } from "../types";

const EV_TO_KJ_PER_MOL = 96.485;
const PERIOD_ENDS = [2, 10, 18, 36, 54, 86, 118];

function getPeriod(atomicNumber: number): number {
  return PERIOD_ENDS.findIndex((periodEnd) => atomicNumber <= periodEnd) + 1;
}

export const ELEMENTS: ElementRecord[] = tableData.map((element) => ({
  symbol: element.symbol,
  name: element.name,
  atomicNumber: element.atomicNumber,
  period: getPeriod(element.atomicNumber),
  electronConfiguration: element.electronConfiguration,
  atomicRadius: element.atomicRadius,
  ionizationEnergy: element.ionizationEnergy === null ? null : element.ionizationEnergy * EV_TO_KJ_PER_MOL,
  electronegativity: element.electronegativity,
  electronAffinity: element.electronAffinity === null ? null : element.electronAffinity * EV_TO_KJ_PER_MOL
}));
