import type { Widget } from "../types";
import { resolveAppPath } from "../config";

export interface LayoutSlots {
  widgets: Widget[];
}

export interface LayoutConfig {
  eyebrow: string;
  title: string;
  intro: string;
  ariaLabel: string;
}

export class Layout {
  private root: HTMLElement | null = null;

  public constructor(private readonly config: LayoutConfig, private readonly slots: LayoutSlots) {}

  public start(): void {
    this.root = document.querySelector<HTMLElement>("#app");
    if (!this.root) throw new Error("App root #app was not found");
    this.root.innerHTML = `<div class="page-shell"><nav class="page-nav" aria-label="Primary"><a href="${resolveAppPath("/trends")}">Periodic trends</a><a href="${resolveAppPath("/correlations")}">Correlations</a></nav><header class="page-header"><p class="eyebrow">${this.config.eyebrow}</p><h1>${this.config.title}</h1><p class="intro">${this.config.intro}</p></header><section class="chart-stack" aria-label="${this.config.ariaLabel}"></section></div>`;
    const stack = this.root.querySelector<HTMLElement>(".chart-stack");
    if (!stack) throw new Error("Chart slot was not created");
    this.slots.widgets.forEach((widget, index) => {
      const slot = document.createElement("article");
      slot.className = "chart-card";
      slot.dataset.slot = `chart-${index + 1}`;
      stack.append(slot);
      widget.mount(slot);
      widget.start();
    });
  }

  public stop(): void {
    this.slots.widgets.forEach((widget) => widget.stop());
    this.root?.replaceChildren();
    this.root = null;
  }
}

export class LayoutFactory {
  public create(config: LayoutConfig, widgets: Widget[]): Layout {
    return new Layout(config, { widgets });
  }
}
