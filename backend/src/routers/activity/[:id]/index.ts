import Elysia from "elysia";

import getActivity from "@back/guards/getActivity";

import info from "./info";
import update from "./update";

const ActivityIdRouter = new Elysia({
  name: "Activity Router",
  prefix: ":activity_id",
})
  .use(getActivity)
  .use(info)
  .use(update);

export default ActivityIdRouter;
