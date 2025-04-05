import dayjs from "dayjs";
import Elysia, { t } from "elysia";
import { createEvents } from "ics";

import getTimetable from "@back/guards/getTimetable";
import EventModel, { weekdayList } from "@back/models/event";
import TimetableModel from "@back/models/timetable";
import exit, { errorElysia } from "@back/utils/error";

const findNextValidWeekday = (date: dayjs.Dayjs, allowedWeekdays: string[]): dayjs.Dayjs => {
  let d = date.clone();
  for (let i = 0; i < 7; i++) {
    const weekday = weekdayList[d.day()];
    if (allowedWeekdays.includes(weekday)) return d;
    d = d.add(1, "day");
  }
  return date;
};

const FORMAT = "YYYY-MM-DD HH:mm:ss";

const exportICS = new Elysia()
  .use(getTimetable)
  .use(EventModel)
  .use(TimetableModel)
  .get(
    "export.ics",
    async ({ query, eventModel, timetable, timetableModel, set, error }) => {
      const { token } = query;

      if (!token) return exit(error, "NO_TOKEN");

      let payload;
      try {
        payload = await timetableModel.verifyIcsAccessToken(token);
      } catch {
        return exit(error, "INVALID_TOKEN");
      }

      if (payload.tid !== timetable._id.toString()) return exit(error, "TOKEN_TID_MISMATCH");

      const events = await eventModel.db.find({ timetable_id: timetable._id });

      const icsEvents = events.map((e) => {
        let startTime = dayjs(e.startTime, FORMAT);
        let endTime = dayjs(e.endTime, FORMAT);

        const duration = endTime.diff(startTime);

        if (e.repeat?.byWeekDay?.length) {
          startTime = findNextValidWeekday(startTime, e.repeat.byWeekDay);
          endTime = startTime.add(duration);
        }

        const icsEvent: any = {
          title: e.title ?? "Untitled",
          start: [
            startTime.year(),
            startTime.month() + 1,
            startTime.date(),
            startTime.hour(),
            startTime.minute(),
          ],
          end: [
            endTime.year(),
            endTime.month() + 1,
            endTime.date(),
            endTime.hour(),
            endTime.minute(),
          ],
          startInputType: "utc",
          endInputType: "utc",
          status: "CONFIRMED",
        };

        if (e.repeat?.frequency) {
          const freq = e.repeat.frequency.toUpperCase();
          const parts: string[] = [`FREQ=${freq}`];

          if (e.repeat.interval && e.repeat.interval > 1) {
            parts.push(`INTERVAL=${e.repeat.interval}`);
          }

          if (e.repeat.byWeekDay?.length) {
            parts.push(`BYDAY=${e.repeat.byWeekDay.join(",")}`);
          }

          if (e.repeat.byMonthDay) {
            parts.push(`BYMONTHDAY=${e.repeat.byMonthDay}`);
          }

          if (e.repeat.bySetPosition) {
            parts.push(`BYSETPOS=${e.repeat.bySetPosition}`);
          }

          if (e.repeat.until) {
            const until = dayjs(e.repeat.until, FORMAT).format("YYYYMMDD[T]HHmmss[Z]");
            parts.push(`UNTIL=${until}`);
          }

          icsEvent.recurrenceRule = parts.join(";");
        }

        return icsEvent;
      });

      const { error: icsErr, value } = createEvents(icsEvents);
      if (icsErr) return exit(error, "CREATE_ICS_FILE_FAILED");

      set.headers["Content-Type"] = "text/calendar";
      set.headers["Content-Disposition"] = "attachment; filename=\"timetable.ics\"";

      return value;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        token: t.String(),
      }),
      response: {
        200: t.String(),
        ...errorElysia(["NO_TOKEN", "INVALID_TOKEN", "TOKEN_TID_MISMATCH", "CREATE_ICS_FILE_FAILED"]),
      },
      detail: {
        tags: ["Timetable"],
        summary: "ICS 파일 다운로드 (.ics)",
        description: "비공개 토큰을 통해 해당 시간표의 ICS 파일을 생성하고 다운로드합니다.",
      },
    }
  );

export default exportICS;