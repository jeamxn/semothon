import Elysia, { t } from "elysia";

import getActivity from "@back/guards/getActivity";
import getUser from "@back/guards/getUser";
import JoinedActivityModel from "@back/models/joined_activity";
import TimetableModel, { MappedTimetable, timetableElysiaSchema } from "@back/models/timetable";

const list = new Elysia()
  .use(getUser)
  .use(getActivity)
  .use(TimetableModel)
  .use(JoinedActivityModel)
  .get(
    "",
    async ({ activity, joinedActivityModel, timetableModel, user }) => {
      const activityId = activity._id;
      const userId = user._id;

      const isMember = await joinedActivityModel.db.exists({
        activity_id: activityId,
        user_id: userId,
      });

      const visibilityFilter = isMember
        ? ["public", "member"]
        : ["public"];

      const timetables = await timetableModel.db.find({
        $or: [
          { owner_type: "activity", owner: activityId },
          { owner_type: "global" },
        ],
        visibility: { $in: visibilityFilter },
      });

      if (!timetables || timetables.length === 0) {
        return [];
      }

      const timetableList: MappedTimetable[] = timetables.map((timetable) => {
        const base = {
          _id: timetable._id.toString(),
          name: timetable.name,
          owner: timetable.owner.toString(),
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
        tags: ["Activity"],
        summary: "활동(동아리) 캘린더 목록 조회",
        description:
          "전체 공개 또는 멤버 공개 캘린더를 조건에 따라 반환합니다.",
      },
      response: {
        200: t.Array(timetableElysiaSchema)
      }
    },
  );

export default list;