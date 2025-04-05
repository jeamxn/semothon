import Elysia from "elysia";

import ActivityIdRouter from "./[id]";
import create from "./create";
import list from "./list";

const ActivityRouter = new Elysia({
  name: "Activity Router",
  prefix: "activity",
})
  .use(list)
  .use(ActivityIdRouter)
  .use(create);

export default ActivityRouter;
