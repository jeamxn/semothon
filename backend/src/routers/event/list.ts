import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import Elysia, { t } from "elysia";

import getUser from "@back/guards/getUser";
import EventModel, { weekdayList } from "@back/models/event";
import JoinedActivityModel from "@back/models/joined_activity";
import TimetableModel from "@back/models/timetable";

dayjs.extend(isSameOrBefore);

const FORMAT = "YYYY-MM-DD HH:mm:ss";

const generateRepeatInstances = (event: any, from: dayjs.Dayjs, to: dayjs.Dayjs) => {
  const instances = [];
  const {
    frequency,
    interval = 1,
    byWeekDay,
    bySetPosition,
    byMonthDay,
    until,
  } = event.repeat;

  const repeatUntil = until ? dayjs(until, FORMAT) : to;
  const start = dayjs(event.startTime, FORMAT);
  const end = dayjs(event.endTime, FORMAT);
  const duration = end.diff(start);

  let current = start.clone();

  while (current.isSameOrBefore(repeatUntil) && current.isSameOrBefore(to)) {
    let instanceStart: dayjs.Dayjs | null = null;

    switch (frequency) {
    case "daily": {
      instanceStart = current.clone();
      current = current.add(interval, "day");
      break;
    }
    case "weekly": {
      const weekday = weekdayList[current.day()];
      if (!byWeekDay || byWeekDay.includes(weekday)) {
        instanceStart = current.clone();
      }
      current = current.add(1, "day");
      break;
    }
    case "monthly": {
      const year = current.year();
      const month = current.month();

      if (byMonthDay) {
        instanceStart = dayjs(`${year}-${month + 1}-${byMonthDay} ${start.format("HH:mm:ss")}`, "YYYY-M-D HH:mm:ss");
      } else if (byWeekDay && bySetPosition) {
        const weekday = byWeekDay[0];
        const weekdayIndex = weekdayList.indexOf(weekday);

        const firstDay = dayjs(new Date(year, month, 1));
        const firstDayIndex = firstDay.day();
        const offset = (7 + weekdayIndex - firstDayIndex) % 7;
        const day = 1 + offset + (bySetPosition - 1) * 7;

        instanceStart = dayjs(new Date(year, month, day)).hour(start.hour()).minute(start.minute());
      }

      current = current.add(1, "month");
      break;
    }
    }

    if (instanceStart) {
      const instanceEnd = instanceStart.add(duration);
      if (instanceEnd.isAfter(from) && instanceStart.isBefore(to)) {
        instances.push({
          _id: event._id.toString(),
          timetable_id: event.timetable_id.toString(),
          title: event.title ?? "",
          startTime: instanceStart.format(FORMAT),
          endTime: instanceEnd.format(FORMAT),
          isAllDay: event.isAllDay ?? false,
        });
      }
    }
  }

  return instances;
};

const list = new Elysia()
  .use(getUser)
  .use(JoinedActivityModel)
  .use(TimetableModel)
  .use(EventModel)
  .get(
    "list",
    async ({ user, joinedActivityModel, timetableModel, eventModel, query }) => {
      const userId = user._id;
      
      const from = dayjs(query.from);
      const to = dayjs(query.to);

      let timetableIds: string[] = [];

      if (query.timetable_id) {
        timetableIds = [query.timetable_id];
      } else {
        const joined = await joinedActivityModel.db.find({ user_id: userId });
        const activityIds = joined.map((j) => j.activity_id);

        const timetables = await timetableModel.db.find({
          $or: [
            { owner_type: "user", owner: userId },
            { owner_type: "activity", owner: { $in: activityIds } },
            { owner_type: "global" },
          ],
        }).lean();

        timetableIds = timetables.map((t) => t._id.toString());
      }

      const singleEvents = await eventModel.db.find({
        timetable_id: { $in: timetableIds },
        startTime: { $lte: to.format(FORMAT) },
        endTime: { $gte: from.format(FORMAT) },
        $or: [
          { repeat: { $exists: false } },
          { "repeat.frequency": null },
        ],
      });

      const repeatingEvents = await eventModel.db.find({
        timetable_id: { $in: timetableIds },
        "repeat.frequency": { $ne: null },
      });

      const events = [
        ...singleEvents.map((e) => ({
          _id: e._id.toString(),
          timetable_id: e.timetable_id.toString(),
          title: e.title ?? "",
          startTime: dayjs(e.startTime, FORMAT).format(FORMAT),
          endTime: dayjs(e.endTime, FORMAT).format(FORMAT),
          isAllDay: e.isAllDay ?? false,
        })),
        ...repeatingEvents.flatMap((e) => generateRepeatInstances(e, from, to)),
      ];

      events.sort((a, b) => dayjs(a.startTime).unix() - dayjs(b.startTime).unix());

      return { events };
    },
    {
      query: t.Object({
        timetable_id: t.Optional(t.String({ description: "조회할 캘린더 ID" })),
        from: t.String({ format: "date", description: "조회 시작일", example: "2025-01-01" }),
        to: t.String({ format: "date", description: "조회 종료일", example: "2025-12-31" }),
      }),
      response: t.Object({
        events: t.Array(
          t.Object({
            _id: t.String(),
            timetable_id: t.String(),
            title: t.String(),
            startTime: t.String({ example: "2025-04-05 10:00:00 " }),
            endTime: t.String({ example: "2025-04-05 11:00:00" }),
            isAllDay: t.Optional(t.Boolean()),
          })
        ),
      }),
      detail: {
        tags: ["Event"],
        summary: "이벤트 목록 조회",
        description:
          "`timetable_id`가 주어지면 해당 캘린더, 없으면 해당 사용자가 전체 조회 가능 캘린더의 이벤트를 반환합니다.",
      },
    }
  );

export default list;