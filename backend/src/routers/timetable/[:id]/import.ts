import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Elysia, { t } from "elysia";
import ical from "node-ical";

import getTimetable from "@back/guards/getTimetable";
import timetableAuthorityService from "@back/guards/timetableAuthorityService";
import EventModel from "@back/models/event";
import exit, { errorElysia } from "@back/utils/error";

dayjs.extend(utc);
dayjs.extend(timezone);

const toUTCFromICSTime = (date: Date | string, tz: string = "Asia/Seoul"): dayjs.Dayjs =>
  dayjs.tz(date, tz);

const importFromICS = new Elysia()
  .use(timetableAuthorityService)
  .use(getTimetable)
  .use(EventModel)
  .post(
    "import",
    async ({ body, eventModel, timetable, error }) => {
      const { file } = body;
      const timetableId = timetable._id;

      if (!file || !(file instanceof File))
        return exit(error, "ICS_FILE_REQUIRED");

      const arrayBuffer = await file.arrayBuffer();
      const content = Buffer.from(arrayBuffer).toString("utf-8");
      const parsed = ical.parseICS(content);

      const inserted = [];
      const expandUntil = dayjs().add(3, "month");

      for (const key in parsed) {
        const item = parsed[key];
        if (item.type !== "VEVENT") continue;

        const tz = item.start?.tz || item.end?.tz || "Asia/Seoul";
        const start = toUTCFromICSTime(item.start, tz);
        const end = toUTCFromICSTime(item.end, tz);
        const duration = end.diff(start);

        const isAllDay =
          item.datetype === "date" ||
          (
            item.start?.getHours?.() === 0 &&
            item.start?.getMinutes?.() === 0 &&
            item.end?.getHours?.() === 0 &&
            item.end?.getMinutes?.() === 0
          );

        if (item.rrule) {
          const instances = item.rrule.between(new Date(), expandUntil.toDate());

          for (const date of instances) {
            const instanceStart = toUTCFromICSTime(date, tz);
            const instanceEnd = isAllDay
              ? instanceStart.set("hour", 23).set("minute", 59).set("second", 59).set("millisecond", 999)
              : instanceStart.add(duration);

            inserted.push(await eventModel.db.create({
              timetable_id: timetableId,
              title: item.summary ?? "",
              startTime: instanceStart.format("YYYY-MM-DD HH:mm:ss"),
              endTime: instanceEnd.format("YYYY-MM-DD HH:mm:ss"),
              isAllDay
            }));
          }
        } else {
          const startTime = start;
          const endTime = isAllDay
            ? startTime.set("hour", 23).set("minute", 59).set("second", 59).set("millisecond", 999)
            : end;

          inserted.push(await eventModel.db.create({
            timetable_id: timetableId,
            title: item.summary ?? "",
            startTime: startTime.format("YYYY-MM-DD HH:mm:ss"),
            endTime: endTime.format("YYYY-MM-DD HH:mm:ss"),
            isAllDay
          }));
        }
      }

      return {
        success: true,
        count: inserted.length,
      };
    },
    {
      body: t.Object(
        {
          file: t.File({ description: "ICS 파일" }),
        },
        { contentType: "multipart/form-data" }
      ),
      response: {
        200: t.Object({
          success: t.Boolean(),
          count: t.Number(),
        }),
        ...errorElysia(["ICS_FILE_REQUIRED"]),
      },
      detail: {
        tags: ["Timetable"],
        summary: "ICS 파일 가져오기",
        description: "ICS (.ics) 파일을 업로드하고, 해당 캘린더에 이벤트를 등록합니다. ICS의 시간대에 따라 UTC로 변환됩니다.",
      },
    }
  );

export default importFromICS;