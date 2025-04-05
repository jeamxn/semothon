import Elysia from "elysia";

import getActivity from "@back/guards/getActivity";

import basic from "./basic";
import details from "./details";

const ActivityUpdateRouter = new Elysia({
  name: "Activity Router",
  prefix: "update",
})
  .use(getActivity)
  .use(basic)
  .use(details);

export default ActivityUpdateRouter;
