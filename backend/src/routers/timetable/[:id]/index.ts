import Elysia from "elysia";

import deleteTimetable from "./delete";
import exportICS from "./export";
import generateICSLink from "./generateICS";
import importFromICS from "./import";
import updateTimetable from "./update";

const TimetableIdRouter = new Elysia({
  name: "Timetable Router",
  prefix: ":timetable_id",
})
  .use(deleteTimetable)
  .use(updateTimetable)
  .use(importFromICS)
  .use(generateICSLink)
  .use(exportICS);

export default TimetableIdRouter;