import { injectable } from "inversify";
import tippy, { type Instance } from "tippy.js";

@injectable()
export class TooltipService {
  private readonly instances = new Map<string, Instance>();
  private started = false;

  public start(): void {
    this.started = true;
  }

  public show(key: string, content: string, reference: Element): void {
    if (!this.started) return;
    let instance = this.instances.get(key);
    if (!instance) {
      instance = tippy(document.body, {
        content: "",
        trigger: "manual",
        delay: 0,
        duration: [80, 80],
        placement: "top",
        arrow: true,
        hideOnClick: false,
        theme: "chem"
      });
      this.instances.set(key, instance);
    }
    instance.setProps({
      content,
      getReferenceClientRect: () => reference.getBoundingClientRect()
    });
    instance.show();
  }

  public hide(key?: string): void {
    if (key) {
      this.instances.get(key)?.hide();
      return;
    }
    this.instances.forEach((instance) => instance.hide());
  }

  public stop(): void {
    this.instances.forEach((instance) => instance.destroy());
    this.instances.clear();
    this.started = false;
  }
}
