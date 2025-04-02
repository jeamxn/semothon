import dayjs from "dayjs";
import Elysia, { t } from "elysia";

import getUser from "@back/guards/getUser";
import ActivityModel, { ActivityCategory, ActivityCategoryType } from "@back/models/activity";
import JoinedActivityModel from "@back/models/joined_activity";
import { IUser } from "@back/models/user";
import exit, { errorElysia } from "@back/utils/error";

const create = new Elysia().use(ActivityModel).use(JoinedActivityModel).use(getUser).post(
  "",
  async ({ activityModel, body, user, joinedActivityModel, error }) => {
    const {
      name,
      headline,
      big_type,
      small_type,
      logo_url,
    } = body;
    const userId = (user as IUser)._id;

    const insert = await activityModel.create({
      name,
      headline,
      big_type: big_type as ActivityCategoryType,
      small_type,
      logo_url,
      key_color: "#000000",
      is_hidden: false,
    });
    if (!insert) {
      return exit(error, "INSERT_ACTIVITY_FAILED");
    }

    const joinedActivity = await joinedActivityModel.db.insertOne({
      user_id: userId,
      activity_id: insert._id,
      permission: "president",
      joined_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });

    return {
      _id: insert._id.toString(),
      created_at: joinedActivity.joined_at,
    };
  },
  {
    body: t.Object({
      name: t.String({
        description: "활동(동아리) 이름",
      }),
      headline: t.String({
        description: "활동(동아리) 한 줄 소개",
      }),
      big_type: t.String({
        description: "활동(동아리) 종류",
        default: "etc",
        examples: ActivityCategory,
      }),
      small_type: t.String({
        description: "활동(동아리) 소분류",
      }),
      logo_url: t.String({
        description: "활동(동아리) 로고 URL",
      }),
    }),
    response: {
      200: t.Object({
        _id: t.String({
          description: "생성된 활동(동아리) ID",
        }),
        created_at: t.String({
          description: "활동(동아리) 생성 날짜",
          format: "date-time",
          default: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          examples: [dayjs().format("YYYY-MM-DD HH:mm:ss")],
        }),
      }),
      ...errorElysia(["NO_ACTIVITY_ID", "NO_ACTIVITY"]),
    },
    detail: {
      tags: ["Activity"],
      summary: "활동(동아리) 생성하기",
      description: "활동(동아리)를 생성합니다.",
    }
  },
);

export default create;
