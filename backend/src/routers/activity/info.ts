import Elysia, { t } from "elysia";

import ActivityModel, { activityElysiaSchema, IActivity } from "@back/models/activity";

const list = new Elysia().use(ActivityModel).get(
  "",
  async ({ activityModel }) => {
    const activitySearch = await activityModel.db.find();
    if (!activitySearch || activitySearch.length === 0) {
      return [];
    }
    const activityList: IActivity[] = activitySearch.map((activity) => {
      return activity.toObject();
    });
    return activityList;
  },
  {
    response: {
      200: t.Array(activityElysiaSchema),
    },
    detail: {
      tags: ["Activity"],
      summary: "모든 활동(동아리) 정보 가져오기",
      description: "모든 활동(동아리)의 정보를 가져옵니다.",
    }
  },
);

export default list;
