import Elysia from "elysia";

import ActivityIdRouter from "./[id]";
import create from "./create";
import list from "./list";
import my from "./my";

const ActivityRouter = new Elysia({
  name: "Activity Router",
  prefix: "activity",
})
  .use(list)
  .use(ActivityIdRouter)
  .use(create)
  .use(my);

export default ActivityRouter;
