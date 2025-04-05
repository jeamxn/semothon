import Elysia from "elysia";

import list from "./list";

const timetableRouter = new Elysia({
  name: "Timetable Router",
  prefix: "timetable",
})
  .use(list);

export default timetableRouter;