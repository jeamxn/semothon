import Elysia, { t } from "elysia";

import ActivityModel, { ActivityCategory, activityElysiaSchema, IActivity } from "@back/models/activity";

const list = new Elysia().use(ActivityModel).get(
  "",
  async ({ activityModel, query }) => {
    console.log("query", query);
    const activitySearch = await activityModel.db.find({
      $or: [
        { is_hidden: false },
        { is_hidden: null },
      ],
      ...(query.big_type && query.big_type !== "all" ? { big_type: query.big_type } : {}),
      ...(query.small_type && query.small_type !== "all" ? { small_type: query.small_type } : {}),
      ...(query.search ? {
        $or: [
          { name: { $regex: query.search, $options: "i" } },
          { headline: { $regex: query.search, $options: "i" } },
          { big_type: { $regex: query.search, $options: "i" } },
          { small_type: { $regex: query.search, $options: "i" } },
        ],
      } : {}),
    });
    if (!activitySearch || activitySearch.length === 0) {
      return [];
    }
    const activityList: IActivity[] = activitySearch.map((activity) => {
      return {
        ...activity.toObject(),
        _id: activity._id.toString(),
      } as unknown as IActivity;
    });
    return activityList;
  },
  {
    query: t.Object({
      big_type: t.Optional(t.Union([t.String({
        description: "활동(동아리) 종류",
        examples: ["all", ...ActivityCategory],
        default: "all",
      }), t.Null()])),
      small_type: t.Optional(t.Union([t.String({
        description: "활동(동아리) 세부 종류",
        default: "all",
      }), t.Null()])),
      search: t.Optional(t.String({
        description: "활동(동아리) 검색 내용",
      })),
    }),
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
