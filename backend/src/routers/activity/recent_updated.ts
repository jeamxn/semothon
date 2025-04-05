import Elysia, { t } from "elysia";

import ActivityModel, { activityElysiaSchema } from "@back/models/activity";

const recent_updated = new Elysia().use(ActivityModel).get(
  "recent_updated",
  async ({ activityModel }) => {
    const find = await activityModel.db.find({
      is_hidden: false,
    }).sort({ updated_datetime: -1 });
    const find_activities_map: any = find.map((item) => ({
      ...item.toObject(),
      _id: item._id.toString(),
    }));
    return find_activities_map;
  },
  {
    response: {
      200: t.Array(activityElysiaSchema),
    },
    detail: {
      tags: ["Activity"],
      summary: "최근 수정된 활동(동아리) 정보 가져오기",
      description: "최근 수정된 활동(동아리)의 정보를 가져옵니다.",
    }
  },
);

export default recent_updated;
