export type PropertyKey = "atomicRadius" | "ionizationEnergy" | "electronegativity" | "electronAffinity";

export interface ElementRecord {
  symbol: string;
  name: string;
  atomicNumber: number;
  period: number;
  electronConfiguration: string;
  atomicRadius: number | null;
  ionizationEnergy: number | null;
  electronegativity: number | null;
  electronAffinity: number | null;
}

export interface Widget {
  mount(slot: HTMLElement): void;
  unmount(): void;
  start(): Promise<void> | void;
  stop(): Promise<void> | void;
}
