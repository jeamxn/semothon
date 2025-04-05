import Elysia from "elysia";

import ActivityRouter from "./activity";
import AuthRouter from "./auth";
import BoardRouter from "./board";
import EventRouter from "./event";
import TimetableRouter from "./timetable";

const IndexRouter = new Elysia({
  name: "Index",
  prefix: "",
})
  .use(AuthRouter)
  .use(ActivityRouter)
  .use(TimetableRouter)
  .use(EventRouter)
  .use(BoardRouter);

export default IndexRouter;
