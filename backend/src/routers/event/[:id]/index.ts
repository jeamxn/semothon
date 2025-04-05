import Elysia from "elysia";

import deleteEvent from "./delete";
import updateEvent from "./update";

const EventIdRouter = new Elysia({
  name: "Event Router",
  prefix: ":event_id",
})
  .use(deleteEvent)
  .use(updateEvent);

export default EventIdRouter;