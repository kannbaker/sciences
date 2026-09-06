import { injectable } from "inversify";
import type { AppEvent } from "../events/AppEvent";

type EventHandler = (event: AppEvent) => void;

@injectable()
export class EventBus {
  private readonly handlers = new Set<EventHandler>();

  public start(): void {}

  public on(handler: EventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  public emit(event: AppEvent): void {
    this.handlers.forEach((handler) => handler(event));
  }

  public stop(): void { this.handlers.clear(); }
}
