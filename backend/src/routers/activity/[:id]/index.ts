import Elysia from "elysia";

import getActivity from "@back/guards/getActivity";

import basic_update from "./basic_update";
import details_update from "./details_update";
import info from "./info";

const ActivityIdRouter = new Elysia({
  name: "Activity Router",
  prefix: ":activity_id",
})
  .use(getActivity)
  .use(info)
  .use(basic_update)
  .use(details_update);

export default ActivityIdRouter;
