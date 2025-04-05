import Elysia, { t } from "elysia";

import JoinedActivityModel from "@back/models/joined_activity";
import { UserWithPermission } from "@back/models/user";
import { errorElysia } from "@back/utils/error";

import getActivity from "./getActivity";

const getActivityAndJoinedUser = new Elysia()
  .use(getActivity)
  .use(JoinedActivityModel)
  .guard({
    params: t.Object({
      activity_id: t.String({
        description: "활동(동아리) ID",
      }),
    }),
    response: {
      ...errorElysia(["NO_ACTIVITY_ID", "NO_ACTIVITY", "INVALID_ID_TYPE"]),
    }
  })
  .resolve(async ({ joinedActivityModel, activity }): Promise<{
    joined_users: UserWithPermission[];
  }> => {
    const joined_users: UserWithPermission[] = await joinedActivityModel.db.aggregate([
      {
        $match: {
          activity_id: activity._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: "$user._id",
          email: "$user.email",
          name: "$user.name",
          picture: "$user.picture",
          activity_id: 1,
          permission: 1,
        },
      },
    ]);

    return {
      joined_users: joined_users,
    };
  })
  .as("plugin");

export default getActivityAndJoinedUser;
