import Elysia, { t } from "elysia";

import TimetableModel, { ITimetable } from "@back/models/timetable";
import exit, { errorElysia } from "@back/utils/error";

const getTimetable = new Elysia()
  .use(TimetableModel)
  .guard({
    params: t.Object({
      timetable_id: t.String({
        description: "캘린더 ID",
      }),
    }),
    response: {
      ...errorElysia(["NO_TIMETABLE_ID", "NO_TIMETABLE", "INVALID_ID_TYPE"]),
    },
  })
  .resolve(async ({
    params,
    error,
    timetableModel,
  }): Promise<{ timetable: ITimetable }> => {
    try {
      const { timetable_id } = params;

      if (!timetable_id) return exit(error, "NO_TIMETABLE_ID");
      const found = await timetableModel.db.findById(timetable_id);
      
      if (!found) return exit(error, "NO_TIMETABLE");

      return { timetable: found.toObject() };
    } catch {
      return exit(error, "INVALID_ID_TYPE");
    }
  })
  .as("plugin");

export default getTimetable;
