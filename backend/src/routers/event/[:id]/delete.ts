import Elysia, { t } from "elysia";

import eventAuthorityService from "@back/guards/eventAuthorityService";
import exit, { errorElysia } from "@back/utils/error";

const deleteEvent = new Elysia()
  .use(eventAuthorityService)
  .delete(
    "",
    async ({ event, eventModel, error }) => {
      try {
        await eventModel.db.deleteOne({ _id: event._id });

        return {
          success: true,
          message: "이벤트 삭제되었습니다.",
        };
      }
      catch {
        return exit(error, "DELETE_FAILED");
      }
      
    },
    {
      params: t.Object({
        id: t.String({ description: "이벤트 ID" }),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
        ...errorElysia(["DELETE_FAILED"]),
      },
      detail: {
        tags: ["Event"],
        summary: "이벤트 삭제",
        description: "이벤트를 삭제합니다.",
      },
    }
  );

export default deleteEvent;
