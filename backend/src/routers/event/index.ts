import Elysia from "elysia";

import EventIdRouter from "./[:id]";
import create from "./create";
import list from "./list";

const EventRouter = new Elysia({
  name: "Event Router",
  prefix: "event",
})
  .use(EventIdRouter)
  .use(list)
  .use(create);

export default EventRouter;