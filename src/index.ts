import "reflect-metadata";
import "./styles.css";
import "tippy.js/dist/tippy.css";
import { App } from "./app/App";
import { createContainer } from "./container/container";
import { SERVICE_TYPES } from "./container/serviceTypes";

const app = createContainer().get<App>(SERVICE_TYPES.App);
app.start();
