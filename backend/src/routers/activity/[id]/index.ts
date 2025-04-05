import Elysia from "elysia";

import getActivity from "@back/guards/getActivity";

import applicationRouter from "./application";
import apply from "./apply";
import info from "./info";
import ActivityMemberRouter from "./member";
import timetableRouter from "./timetable";
import ActivityUpdateRouter from "./update";

const ActivityIdRouter = new Elysia({
  name: "Activity Router",
  prefix: ":activity_id",
})
  .use(apply)
  .use(applicationRouter)
  .use(getActivity)
  .use(info)
  .use(ActivityUpdateRouter)
  .use(ActivityMemberRouter)
  .use(timetableRouter);

export default ActivityIdRouter;
