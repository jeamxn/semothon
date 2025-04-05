import Elysia from "elysia";

import TimetableIdRouter from "./[id]";
import createTimetable from "./create";
import listTimetable from "./list";

const TimetableRouter = new Elysia({
  name: "Timetable Router",
  prefix: "timetable",
})
  .use(createTimetable)
  .use(listTimetable)
  .use(TimetableIdRouter);

export default TimetableRouter;
