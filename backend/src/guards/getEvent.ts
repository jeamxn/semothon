import Elysia, { t } from "elysia";

import EventModel, { IEvent } from "@back/models/event";
import exit, { errorElysia } from "@back/utils/error";

const getEvent = new Elysia()
  .use(EventModel)
  .guard({
    params: t.Object({
      event_id: t.String({
        description: "이벤트 ID",
      }),
    }),
    response: {
      ...errorElysia(["NO_EVENT_ID", "NO_EVENT", "INVALID_ID_TYPE"]),
    },
  })
  .resolve(async ({
    params,
    error,
    eventModel,
  }): Promise<{ event: IEvent }> => {
    try {
      const { event_id } = params;

      if (!event_id) return exit(error, "NO_EVENT_ID");
      const found = await eventModel.db.findById(event_id);
      
      if (!found) return exit(error, "NO_EVENT");

      return { event: found.toObject() };
    } catch {
      return exit(error, "INVALID_ID_TYPE");
    }
  })
  .as("plugin");

export default getEvent;
