import Elysia, { t } from "elysia";

import timetableAuthorityService from "@back/guards/timetableAuthorityService";
import exit, { errorElysia } from "@back/utils/error";

const updateTimetable = new Elysia()
  .use(timetableAuthorityService)
  .patch(
    "",
    async ({ body, timetable, timetableModel, error }) => {
      const updated = await timetableModel.db.updateOne(
        { _id: timetable._id },
        {
          $set: {
            ...body,
          },
        }
      );
      if (!updated || updated.matchedCount < 1) {
        return exit(error, "UPDATE_FAILED");
      }
      return {
        success: true,
        message: "캘린더(시간표) 정보 수정했습니다.",
      };
    },
    {
      params: t.Object({
        id: t.String({ description: "캘린더 ID" }),
      }),
      body: t.Object({
        name: t.Optional(t.String({ description: "새 이름" })),
      }),
      response: {
        200: t.Object({
          success: t.Boolean({
            description: "캘린더(시간표) 정보 수정 성공 여부",
            examples: [true],
          }),
          message: t.String({
            description: "캘린더(시간표) 정보 수정 성공 메시지",
            examples: ["캘린더(시간표) 정보 수정했습니다."],
          }),
        }),
        ...errorElysia(["UPDATE_FAILED"]),
      },
      detail: {
        tags: ["Timetable"],
        summary: "캘린더(시간표) 수정",
        description: "캘린더(시간표) 이름을 수정합니다.",
      },
    }
  );

export default updateTimetable;
