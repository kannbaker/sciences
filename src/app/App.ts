import { inject, injectable } from "inversify";
import { SERVICE_TYPES } from "../container/serviceTypes";
import { Layout, LayoutFactory } from "../layout/Layout";
import { CorrelationWidgets } from "../widgets/PropertyWidgets";
import type { Widget } from "../types";
import type { TooltipService } from "../services/TooltipService";
import type { EventBus } from "../services/EventBus";
import type { RouterService } from "../services/RouterService";

@injectable()
export class App {
  public constructor(
    @inject(SERVICE_TYPES.CorrelationWidgets) private readonly correlationWidgets: CorrelationWidgets,
    @inject(SERVICE_TYPES.TooltipService) private readonly tooltipService: TooltipService,
    @inject(SERVICE_TYPES.EventBus) private readonly eventBus: EventBus,
    @inject(SERVICE_TYPES.RouterService) private readonly router: RouterService,
    @inject(SERVICE_TYPES.AtomicRadiusWidget) private readonly atomicRadius: Widget,
    @inject(SERVICE_TYPES.IonizationEnergyWidget) private readonly ionizationEnergy: Widget,
    @inject(SERVICE_TYPES.ElectronegativityWidget) private readonly electronegativity: Widget,
    @inject(SERVICE_TYPES.ElectronAffinityWidget) private readonly electronAffinity: Widget
  ) {
    const layoutFactory = new LayoutFactory();
    this.trendsLayout = layoutFactory.create({ eyebrow: "CHEM / PERIODIC TRENDS", title: "How the elements change", intro: "A compact view of four atomic properties across all 118 elements.", ariaLabel: "Periodic property charts" }, [atomicRadius, ionizationEnergy, electronegativity, electronAffinity]);
    this.correlationsLayout = layoutFactory.create({ eyebrow: "CHEM / CORRELATIONS", title: "How properties relate", intro: "Compare pairs of atomic properties across the periodic table.", ariaLabel: "Property correlation charts" }, correlationWidgets.widgets);
  }

  private readonly trendsLayout: Layout;
  private readonly correlationsLayout: Layout;

  public start(): void {
    this.tooltipService.start();
    this.eventBus.start();
    this.router.register("/trends", this.trendsLayout);
    this.router.register("/correlations", this.correlationsLayout);
    this.router.start();
  }

  public stop(): void {
    this.router.stop();
    this.tooltipService.stop();
    this.eventBus.stop();
  }
}
