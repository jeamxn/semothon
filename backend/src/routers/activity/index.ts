import Elysia from "elysia";

import ActivityIdRouter from "./[:id]";

const ActivityRouter = new Elysia({
  name: "Activity Router",
  prefix: "activity",
})
  .use(ActivityIdRouter);

export default ActivityRouter;
