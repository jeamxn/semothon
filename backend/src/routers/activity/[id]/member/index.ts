import Elysia from "elysia";

import getActivity from "@back/guards/getActivity";

import list from "./list";

const ActivityMemberRouter = new Elysia({
  name: "Activity Router",
  prefix: "member",
})
  .use(getActivity)
  .use(list);

export default ActivityMemberRouter;
