import Elysia from "elysia";

import status from "./status";
import update from "./update";

const applicationIdRouter = new Elysia({
  name: "Application ID Router",
  prefix: ":application_id",
})
  .use(update)
  .use(status);

export default applicationIdRouter;