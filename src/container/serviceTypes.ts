export const SERVICE_TYPES = {
  App: Symbol.for("App"),
  EventBus: Symbol.for("EventBus"),
  RouterService: Symbol.for("RouterService"),
  ShowTooltipFacade: Symbol.for("ShowTooltipFacade"),
  CorrelationWidgets: Symbol.for("CorrelationWidgets"),
  TooltipService: Symbol.for("TooltipService"),
  AtomicRadiusWidget: Symbol.for("AtomicRadiusWidget"),
  IonizationEnergyWidget: Symbol.for("IonizationEnergyWidget"),
  ElectronegativityWidget: Symbol.for("ElectronegativityWidget"),
  ElectronAffinityWidget: Symbol.for("ElectronAffinityWidget")
} as const;
