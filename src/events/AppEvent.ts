export type ShowTooltipAppEvent = {
  event: "showTooltip";
  showTooltip: {
    atomicNumber: number;
  };
};

export type HideTooltipAppEvent = {
  event: "hideTooltip";
  hideTooltip: Record<string, never>;
};

export type AppEvent = ShowTooltipAppEvent | HideTooltipAppEvent;
