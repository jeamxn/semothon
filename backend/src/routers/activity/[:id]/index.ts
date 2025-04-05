import Elysia from "elysia";

import getActivity from "@back/guards/getActivity";

import info from "./info";
import ActivityMemberRouter from "./member";
import ActivityUpdateRouter from "./update";

const ActivityIdRouter = new Elysia({
  name: "Activity Router",
  prefix: ":activity_id",
})
  .use(getActivity)
  .use(info)
  .use(ActivityUpdateRouter)
  .use(ActivityMemberRouter);

export default ActivityIdRouter;
