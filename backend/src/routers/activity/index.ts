import Elysia from "elysia";

import ActivityIdRouter from "./[id]";
import create from "./create";
import list from "./list";
import listRecruiting from "./list-recruiting";
import my from "./my";
import recent_updated from "./recent_updated";

const ActivityRouter = new Elysia({
  name: "Activity Router",
  prefix: "activity",
})
  .use(list)
  .use(listRecruiting)
  .use(ActivityIdRouter)
  .use(create)
  .use(my)
  .use(recent_updated);

export default ActivityRouter;
