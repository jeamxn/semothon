import Elysia from "elysia";

import getActivity from "@back/guards/getActivity";

import info from "./info";

const ActivityIdRouter = new Elysia({
  name: "Activity Router",
  prefix: ":id",
})
  .use(getActivity)
  .use(info);

export default ActivityIdRouter;
