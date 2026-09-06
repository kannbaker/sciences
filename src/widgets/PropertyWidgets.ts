import { inject, injectable } from "inversify";
import { ELEMENTS } from "../data/elements";
import { SERVICE_TYPES } from "../container/serviceTypes";
import type { TooltipService } from "../services/TooltipService";
import type { ShowTooltipFacade } from "../services/ShowTooltipFacade";
import { ChartWidget, type ChartDefinition } from "./ChartWidget";

const definitions: Record<string, ChartDefinition> = {
  radius: { key: "radius", title: "Atomic radius", label: "AR", property: "atomicRadius", unit: " pm", color: "#e76f51", description: "Distance from nucleus to the outer electron shell" },
  ionization: { key: "ionization", title: "First ionization energy", label: "FIE", property: "ionizationEnergy", unit: " kJ/mol", color: "#2a9d8f", description: "Energy required to remove the first electron" },
  electronegativity: { key: "electronegativity", title: "Electronegativity", label: "EN", property: "electronegativity", unit: "", color: "#e9c46a", description: "Pauling scale · noble gases omitted" },
  affinity: { key: "affinity", title: "Electron affinity", label: "EA", property: "electronAffinity", unit: " kJ/mol", color: "#457b9d", description: "Energy released when an electron is added" }
};

@injectable()
export class AtomicRadiusWidget extends ChartWidget { public constructor(@inject(SERVICE_TYPES.TooltipService) tooltipService: TooltipService, @inject(SERVICE_TYPES.ShowTooltipFacade) showTooltip: ShowTooltipFacade) { super(ELEMENTS, definitions.radius, tooltipService, showTooltip); } }
@injectable()
export class IonizationEnergyWidget extends ChartWidget { public constructor(@inject(SERVICE_TYPES.TooltipService) tooltipService: TooltipService, @inject(SERVICE_TYPES.ShowTooltipFacade) showTooltip: ShowTooltipFacade) { super(ELEMENTS, definitions.ionization, tooltipService, showTooltip); } }
@injectable()
export class ElectronegativityWidget extends ChartWidget { public constructor(@inject(SERVICE_TYPES.TooltipService) tooltipService: TooltipService, @inject(SERVICE_TYPES.ShowTooltipFacade) showTooltip: ShowTooltipFacade) { super(ELEMENTS, definitions.electronegativity, tooltipService, showTooltip); } }
@injectable()
export class ElectronAffinityWidget extends ChartWidget { public constructor(@inject(SERVICE_TYPES.TooltipService) tooltipService: TooltipService, @inject(SERVICE_TYPES.ShowTooltipFacade) showTooltip: ShowTooltipFacade) { super(ELEMENTS, definitions.affinity, tooltipService, showTooltip); } }

const correlationDefinitions: ChartDefinition[] = [
  { key: "radius-electronegativity", title: "Atomic radius × electronegativity", label: "EN", property: "electronegativity", xProperty: "atomicRadius", xLabel: "AR", xUnit: " pm", unit: "", normalized: true, color: "#e76f51", description: "Normalized 0–1" },
  { key: "radius-ionization", title: "Atomic radius × ionization energy", label: "FIE", property: "ionizationEnergy", xProperty: "atomicRadius", xLabel: "AR", xUnit: " pm", unit: " kJ/mol", normalized: true, color: "#e76f51", description: "Normalized 0–1" },
  { key: "radius-affinity", title: "Atomic radius × electron affinity", label: "EA", property: "electronAffinity", xProperty: "atomicRadius", xLabel: "AR", xUnit: " pm", unit: " kJ/mol", normalized: true, color: "#e76f51", description: "Normalized 0–1" },
  { key: "electronegativity-ionization", title: "Electronegativity × ionization energy", label: "FIE", property: "ionizationEnergy", xProperty: "electronegativity", xLabel: "EN", unit: " kJ/mol", normalized: true, color: "#e9c46a", description: "Normalized 0–1" },
  { key: "electronegativity-affinity", title: "Electronegativity × electron affinity", label: "EA", property: "electronAffinity", xProperty: "electronegativity", xLabel: "EN", unit: " kJ/mol", normalized: true, color: "#e9c46a", description: "Normalized 0–1" },
  { key: "ionization-affinity", title: "Ionization energy × electron affinity", label: "EA", property: "electronAffinity", xProperty: "ionizationEnergy", xLabel: "FIE", xUnit: " kJ/mol", unit: " kJ/mol", normalized: true, color: "#2a9d8f", description: "Normalized 0–1" }
];

@injectable()
export class CorrelationWidgets {
  public constructor(
    @inject(SERVICE_TYPES.TooltipService) tooltipService: TooltipService,
    @inject(SERVICE_TYPES.ShowTooltipFacade) showTooltip: ShowTooltipFacade
  ) {
    this.widgets = correlationDefinitions.map((definition) => new ChartWidget(ELEMENTS, definition, tooltipService, showTooltip));
  }

  public readonly widgets: ChartWidget[];
}
