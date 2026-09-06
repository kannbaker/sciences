# sciences

Small client-only TypeScript app for exploring periodic trends with D3.js. It plots atomic radius, first ionization energy, electronegativity, and electron affinity against atomic number `Z` for all 118 elements. Points are colored by period and missing measurements are left out.

## Run

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3100/`.

## Architecture

- `LayoutFactory` creates configured layouts with their widget slots.
- `Layout` owns the page shell, slot order, and page-level styles.
- `ChartWidget` owns its SVG rendering, resize handling, mounting, and unmounting.
- `ShowTooltipFacade` is the single application-wide widget boundary for tooltip events.
- `EventBus` transports typed `AppEvent` values and is used by the facade, not by widgets directly.
- `TooltipService` is a singleton started by `App`; widgets call only `show` and `hide` while rendering points.
- `EventBus` is a singleton started by `App`; hover events synchronize highlighting and tooltips across all charts.
- `createContainer` wires the object graph with Inversify.

There is no backend and no React dependency. Element data comes from the `periodic-table-data` package; ionization energy and electron affinity are converted from eV to kJ/mol in `src/data/elements.ts`.
