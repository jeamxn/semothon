import dayjs from "dayjs";
import Elysia, { t } from "elysia";

import timetableAuthorityService from "@back/guards/timetableAuthorityService";
import EventModel, { eventElysiaSchema } from "@back/models/event";
import exit, { errorElysia } from "@back/utils/error";

const FORMAT = "YYYY-MM-DD HH:mm:ss";

const normalizeRepeat = (repeat: any) => {
  if (!repeat?.frequency || repeat.frequency === "none") return undefined;

  return {
    frequency: repeat.frequency,
    interval: repeat.interval ?? 1,
    byWeekDay: repeat.byWeekDay,
    bySetPosition: repeat.bySetPosition,
    byMonthDay: repeat.byMonthDay,
    until: repeat.until ? dayjs(repeat.until).format(FORMAT) : undefined,
  };
};

const create = new Elysia()
  .use(timetableAuthorityService)
  .use(EventModel)
  .post(
    "create",
    async ({ body, eventModel, error }) => {
      try {
        const repeat = normalizeRepeat(body.repeat);

        const event = await eventModel.db.create({
          timetable_id: body.timetable_id,
          title: body.title ?? "",
          startTime: dayjs(body.startTime).format(FORMAT),
          endTime: dayjs(body.endTime).format(FORMAT),
          isAllDay: body.isAllDay ?? false,
          repeat,
        });

        return {
          success: true,
          message: "이벤트 생성 성공",
          eventId: event._id.toString(),
        };
      } catch (err) {
        return exit(error, "INSERT_EVENT_FAILED");
      }
    },
    {
      body: t.Composite([
        t.Object({
          timetable_id: t.String({ description: "캘린더 ID" }),
        }),
        eventElysiaSchema
      ]),
      response: {
        200: t.Object({
          success: t.Boolean(),
          message: t.String(),
          eventId: t.String(),
        }),
        ...errorElysia(["INSERT_EVENT_FAILED"]),
      },
      detail: {
        tags: ["Event"],
        summary: "이벤트 생성",
        description: "일반 또는 반복 이벤트를 생성합니다. `repeat` 옵션으로 고급 반복 설정도 가능합니다.",
      },
    }
  );

export default create;