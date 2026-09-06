import { injectable } from "inversify";
import { getRoutePath, resolveAppPath } from "../config";

export interface Route {
  start(): void;
  stop(): void;
}

@injectable()
export class RouterService {
  private readonly routes = new Map<string, Route>();
  private activeRoute: Route | null = null;
  private started = false;
  private readonly handlePopState = (): void => this.render(this.getPath());
  private readonly handleLinkClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
    const path = link ? getRoutePath(link.pathname) : "";
    if (!link || link.origin !== window.location.origin || !this.routes.has(path)) return;
    event.preventDefault();
    this.navigate(path, false);
  };

  public register(path: string, route: Route): void { this.routes.set(path, route); }

  public start(): void {
    if (this.started) return;
    this.started = true;
    window.addEventListener("popstate", this.handlePopState);
    document.addEventListener("click", this.handleLinkClick);
    const path = this.getPath();
    if (this.routes.has(path)) this.render(path);
    else this.navigate("/trends", true);
  }

  public stop(): void {
    window.removeEventListener("popstate", this.handlePopState);
    document.removeEventListener("click", this.handleLinkClick);
    this.activeRoute?.stop();
    this.activeRoute = null;
    this.started = false;
  }

  private navigate(path: string, replace: boolean): void {
    window.history[replace ? "replaceState" : "pushState"]({}, "", resolveAppPath(path));
    this.render(path);
  }

  private render(path: string): void {
    this.activeRoute?.stop();
    this.activeRoute = this.routes.get(path) ?? null;
    this.activeRoute?.start();
  }

  private getPath(): string { return getRoutePath(window.location.pathname); }
}
