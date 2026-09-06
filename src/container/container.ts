import { Container } from "inversify";
import { App } from "../app/App";
import { TooltipService } from "../services/TooltipService";
import { EventBus } from "../services/EventBus";
import { RouterService } from "../services/RouterService";
import { ShowTooltipFacade } from "../services/ShowTooltipFacade";
import { CorrelationWidgets } from "../widgets/PropertyWidgets";
import { AtomicRadiusWidget, ElectronAffinityWidget, ElectronegativityWidget, IonizationEnergyWidget } from "../widgets/PropertyWidgets";
import { SERVICE_TYPES } from "./serviceTypes";

export function createContainer(): Container {
  const container = new Container();
  container.bind<App>(SERVICE_TYPES.App).to(App).inSingletonScope();
  container.bind<TooltipService>(SERVICE_TYPES.TooltipService).to(TooltipService).inSingletonScope();
  container.bind<EventBus>(SERVICE_TYPES.EventBus).to(EventBus).inSingletonScope();
  container.bind<RouterService>(SERVICE_TYPES.RouterService).to(RouterService).inSingletonScope();
  container.bind<ShowTooltipFacade>(SERVICE_TYPES.ShowTooltipFacade).to(ShowTooltipFacade).inSingletonScope();
  container.bind<CorrelationWidgets>(SERVICE_TYPES.CorrelationWidgets).to(CorrelationWidgets).inSingletonScope();
  container.bind<AtomicRadiusWidget>(SERVICE_TYPES.AtomicRadiusWidget).to(AtomicRadiusWidget).inSingletonScope();
  container.bind<IonizationEnergyWidget>(SERVICE_TYPES.IonizationEnergyWidget).to(IonizationEnergyWidget).inSingletonScope();
  container.bind<ElectronegativityWidget>(SERVICE_TYPES.ElectronegativityWidget).to(ElectronegativityWidget).inSingletonScope();
  container.bind<ElectronAffinityWidget>(SERVICE_TYPES.ElectronAffinityWidget).to(ElectronAffinityWidget).inSingletonScope();
  return container;
}
