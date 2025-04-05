import Elysia, { t } from "elysia";
import { ObjectId } from "mongoose";

import getUser from "@back/guards/getUser";
import JoinedActivityModel from "@back/models/joined_activity";
import TimetableModel, { MappedTimetable, timetableElysiaSchema } from "@back/models/timetable";

const listTimetable = new Elysia()
  .use(getUser)
  .use(TimetableModel)
  .use(JoinedActivityModel)
  .get(
    "list",
    async ({ timetableModel, user, joinedActivityModel }) => {
      const userId = user._id;

      const joinedActivity = await joinedActivityModel.db.find({ user_id: userId });
      const activityIds = joinedActivity?.map((j) => j.activity_id);

      const timetables = await timetableModel.db.find({
        $or: [
          { owner_type: "user", owner: userId },
          { owner_type: "activity", owner: { $in: activityIds } },
          { owner_type: "global" },
        ]
      });

      if (!timetables || timetables.length === 0) {
        return [];
      }
    
      const timetableList: MappedTimetable[] = timetables.map((timetable) => {
        const base = {
          _id: (timetable._id as ObjectId).toString(),
          name: timetable.name,
          owner: (timetable.owner as ObjectId).toString(),
        };
          
        if (timetable.owner_type === "activity") {
          return {
            ...base,
            owner_type: "activity",
            visibility: timetable.visibility ?? "member",
          } satisfies MappedTimetable;
        }
          
        return {
          ...base,
          owner_type: timetable.owner_type,
        } satisfies MappedTimetable;
      });

      return timetableList;
    },
    {
      detail: {
        tags: ["Timetable"],
        summary: "캘린더(시간표) 목록 조회",
        description:
          "사용자 본인, 소속된 활동, 또는 전역(global) 공개된 캘린더들을 모두 불러옵니다.",
      },
      response: {
        200: t.Array(timetableElysiaSchema)
      }
    },
  );

export default listTimetable;