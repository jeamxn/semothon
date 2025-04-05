import Elysia, { t } from "elysia";

import getUser from "@back/guards/getUser";
import ActivityModel, { activityElysiaSchema } from "@back/models/activity";
import JoinedActivityModel, { joinedActivityElysiaSchema } from "@back/models/joined_activity";

const my = new Elysia().use(JoinedActivityModel).use(ActivityModel).use(getUser).get(
  "my",
  async ({ joinedActivityModel, activityModel, user }) => {
    const find = await joinedActivityModel.db.find({
      user_id: user._id,
    });
    const find_ids = find.map((item) => item.activity_id);
    const find_activities = await activityModel.db.find({
      _id: { $in: find_ids },
    });
    const find_activities_map: any = find_activities.map((item) => ({
      ...item.toObject(),
      _id: item._id.toString(),
      my_permission: find.find((joined) => joined.activity_id.toString() === item._id.toString())?.permission,
    }));
    return find_activities_map;
  },
  {
    response: {
      200: t.Array(
        t.Object({
          ...activityElysiaSchema.properties,
          my_permission: joinedActivityElysiaSchema.properties.permission,
        }),
      ),
    },
    detail: {
      tags: ["Activity"],
      summary: "나의 활동(동아리) 정보 가져오기",
      description: "나의 활동(동아리)의 정보를 가져옵니다.",
    }
  },
);

export default my;
