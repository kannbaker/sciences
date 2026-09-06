import * as d3 from "d3";
import type { ElementRecord, PropertyKey, Widget } from "../types";
import type { TooltipService } from "../services/TooltipService";
import type { ShowTooltipFacade } from "../services/ShowTooltipFacade";

export interface ChartDefinition {
  key: string;
  title: string;
  property: PropertyKey;
  label?: string;
  xProperty?: PropertyKey;
  xLabel?: string;
  xUnit?: string;
  normalized?: boolean;
  unit: string;
  color: string;
  description: string;
}

export class ChartWidget implements Widget {
  private static readonly PERIOD_COLORS = ["#e76f51", "#f4a261", "#e9c46a", "#2a9d8f", "#457b9d", "#6d597a", "#b56576"];

  private slot: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private renderFrame: number | null = null;
  private readonly handleShow = ({ atomicNumber }: { atomicNumber: number }): void => this.updateHover(atomicNumber);
  private readonly handleHide = (): void => this.updateHover(null);

  public constructor(private readonly elements: ElementRecord[], private readonly definition: ChartDefinition, private readonly tooltipService: TooltipService, private readonly showTooltip: ShowTooltipFacade) {}

  public mount(slot: HTMLElement): void {
    this.slot = slot;
    this.render();
    this.resizeObserver = new ResizeObserver(() => this.scheduleRender());
    this.resizeObserver.observe(slot);
  }

  public unmount(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.renderFrame !== null) cancelAnimationFrame(this.renderFrame);
    this.renderFrame = null;
    this.showTooltip.unsubscribe(this.handleShow);
    this.showTooltip.unsubscribe(this.handleHide);
    this.slot?.replaceChildren();
    this.slot = null;
  }

  public start(): void {
    this.showTooltip.onShow(this.handleShow);
    this.showTooltip.onHide(this.handleHide);
  }
  public stop(): void { this.unmount(); }

  private scheduleRender(): void {
    if (this.renderFrame !== null) return;
    this.renderFrame = requestAnimationFrame(() => {
      this.renderFrame = null;
      this.render();
    });
  }

  private updateHover(atomicNumber: number | null): void {
    if (!this.slot) return;
    this.slot
      .querySelectorAll(".point.is-active")
      .forEach((point) => point.classList.remove("is-active"));
    if (atomicNumber === null) {
      this.tooltipService.hide();
      return;
    }
    const element = this.elements.find((item) => item.atomicNumber === atomicNumber);
    if (!element) return;
    if (element[this.definition.property] === null || (this.definition.xProperty && element[this.definition.xProperty] === null)) {
      this.tooltipService.hide(this.definition.key);
      return;
    }
    const point = this.slot.querySelector<SVGCircleElement>(`.point[data-atomic-number="${atomicNumber}"]`);
    if (point) {
      point.classList.add("is-active");
      const value = element[this.definition.property];
      this.tooltipService.show(this.definition.key, this.formatTooltip(element), point);
    } else this.tooltipService.hide(this.definition.key);
  }

  private formatTooltip(element: ElementRecord): string {
    const value = element[this.definition.property];
    const valueText = value === null ? "no data" : `${this.formatValue(this.definition.property, value)}${this.definition.unit}`;
    const valenceConfiguration = element.electronConfiguration.replace(/^\[[^\]]+\]\s*/, "");
    const lines = [`Z: ${element.atomicNumber} · ${element.name} [${element.symbol}]`, `Period: ${element.period} · valence: ${valenceConfiguration}`];
    if (this.definition.xProperty) lines.push(`${this.definition.xLabel ?? this.getPropertyLabel(this.definition.xProperty)}: ${this.formatValue(this.definition.xProperty, element[this.definition.xProperty])}${this.definition.xUnit ?? ""}`);
    lines.push(`${this.definition.label ?? this.getPropertyLabel(this.definition.property)}: ${valueText}`);
    return lines.join("\n");
  }

  private getPropertyLabel(property: PropertyKey): string {
    return { atomicRadius: "Atomic radius", ionizationEnergy: "Ionization energy", electronegativity: "Electronegativity", electronAffinity: "Electron affinity" }[property];
  }

  private formatValue(property: PropertyKey, value: number | null): string {
    if (value === null) return "no data";
    if (property === "ionizationEnergy" || property === "electronAffinity") return String(Math.round(value));
    return String(value);
  }

  private formatAxisValue(property: PropertyKey, value: number): string {
    if (property === "ionizationEnergy" || property === "electronAffinity") return String(Math.round(value));
    if (property === "electronegativity") return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    return String(Math.round(value));
  }

  private render(): void {
    if (!this.slot) return;
    const width = Math.max(this.slot.clientWidth, 320);
    const height = Math.max(this.slot.clientHeight, 280);
    const margin = { top: 30, right: 16, bottom: 38, left: 92 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const values = this.elements.filter((element) => element[this.definition.property] !== null && (!this.definition.xProperty || element[this.definition.xProperty] !== null)) as (ElementRecord & Record<PropertyKey, number>)[];
    const xProperty = this.definition.xProperty;
    const rawXDomain: [number, number] = xProperty ? d3.extent(values, (element) => element[xProperty] as number) as [number, number] : [1, 118];
    const rawYDomain = [d3.min(values, (element) => element[this.definition.property]) ?? 0, d3.max(values, (element) => element[this.definition.property]) ?? 1] as [number, number];
    const xDomain = this.definition.normalized ? [0, 1] : rawXDomain;
    const yDomain = this.definition.normalized ? [0, 1] : [xProperty ? rawYDomain[0] : 0, rawYDomain[1]];
    const x = d3
      .scaleLinear()
      .domain(xDomain)
      .nice()
      .range([0, chartWidth]);
    const y = d3
      .scaleLinear()
      .domain(yDomain)
      .nice()
      .range([chartHeight, 0]);
    const normalize = (value: number, domain: [number, number]): number => domain[1] === domain[0] ? 0.5 : (value - domain[0]) / (domain[1] - domain[0]);
    const getX = (element: ElementRecord): number => xProperty ? (this.definition.normalized ? normalize(element[xProperty] as number, rawXDomain) : element[xProperty] as number) : element.atomicNumber;
    const getY = (element: ElementRecord): number => this.definition.normalized ? normalize(element[this.definition.property] as number, rawYDomain) : element[this.definition.property] as number;
    const svg = d3
      .select(this.slot)
      .html("")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img");
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", margin.left)
      .attr("y", 18)
      .text(this.definition.title);
    const group = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const horizontalGridAxis = d3
      .axisLeft(y)
      .ticks(4)
      .tickSize(-chartWidth)
      .tickFormat(() => "");
    group
      .append("g")
      .attr("class", "grid horizontal-grid")
      .call(horizontalGridAxis);
    const xGridAxis = xProperty
      ? d3
        .axisBottom(x)
        .ticks(5)
      : d3
        .axisBottom(x)
        .tickValues(d3.range(10, 119, 10));
    const xAxis = xProperty
      ? d3
        .axisBottom(x)
        .ticks(5)
      : d3
        .axisBottom(x)
        .tickValues(d3.range(10, 119, 10));
    const verticalGridAxis = xGridAxis
      .tickSize(-chartHeight)
      .tickFormat(() => "");
    group
      .append("g")
      .attr("class", "grid vertical-grid")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(verticalGridAxis);
    const formattedXAxis = xAxis
      .tickFormat((value) => xProperty && this.definition.normalized
        ? `${this.formatAxisValue(xProperty, rawXDomain[0] + Number(value) * (rawXDomain[1] - rawXDomain[0]))}${this.definition.xUnit ?? ""}`
        : `${value}${xProperty ? this.definition.xUnit ?? "" : ""}`);
    group
      .append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(formattedXAxis);
    const yAxis = d3
      .axisLeft(y)
      .ticks(5)
      .tickFormat((value) => `${this.formatAxisValue(this.definition.property, this.definition.normalized ? rawYDomain[0] + Number(value) * (rawYDomain[1] - rawYDomain[0]) : Number(value))}${this.definition.unit}`);
    group
      .append("g")
      .attr("class", "axis")
      .call(yAxis);
    group
      .selectAll(".point")
      .data(values)
      .join("circle")
      .attr("class", "point")
      .attr("data-atomic-number", (element) => element.atomicNumber)
      .attr("tabindex", 0)
      .attr("cx", (element) => x(getX(element)))
      .attr("cy", (element) => y(getY(element)))
      .attr("r", 4.5)
      .attr("fill", (element) => ChartWidget.PERIOD_COLORS[element.period - 1])
      .on("pointerenter focus", (_, element) => this.showTooltip.show(element.atomicNumber))
      .on("pointerleave blur", () => this.showTooltip.hide());
  }
}
