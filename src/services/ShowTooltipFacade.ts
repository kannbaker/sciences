import { inject, injectable } from "inversify";
import { SERVICE_TYPES } from "../container/serviceTypes";
import type { EventBus } from "./EventBus";

export interface ShowTooltipPayload {
  atomicNumber: number;
}

type ShowHandler = (payload: ShowTooltipPayload) => void;
type HideHandler = () => void;

@injectable()
export class ShowTooltipFacade {
  private readonly showHandlers = new Map<ShowHandler, () => void>();
  private readonly hideHandlers = new Map<HideHandler, () => void>();

  public constructor(@inject(SERVICE_TYPES.EventBus) private readonly eventBus: EventBus) {}

  public onShow(handler: ShowHandler): void {
    this.unsubscribe(handler);
    const unsubscribe = this.eventBus.on((event) => {
      if (event.event === "showTooltip") handler(event.showTooltip);
    });
    this.showHandlers.set(handler, unsubscribe);
  }

  public onHide(handler: HideHandler): void {
    this.unsubscribe(handler);
    const unsubscribe = this.eventBus.on((event) => {
      if (event.event === "hideTooltip") handler();
    });
    this.hideHandlers.set(handler, unsubscribe);
  }

  public unsubscribe(handler: ShowHandler | HideHandler): void {
    this.showHandlers.get(handler as ShowHandler)?.();
    this.showHandlers.delete(handler as ShowHandler);
    this.hideHandlers.get(handler as HideHandler)?.();
    this.hideHandlers.delete(handler as HideHandler);
  }

  public show(atomicNumber: number): void {
    this.eventBus.emit({
      event: "showTooltip",
      showTooltip: { atomicNumber }
    });
  }

  public hide(): void {
    this.eventBus.emit({
      event: "hideTooltip",
      hideTooltip: {}
    });
  }
}
